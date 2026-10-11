import { useSignIn, useSignUp } from "@clerk/expo";
import { useSSO } from "@clerk/expo/experimental";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { VerificationModal } from "@/components/VerificationModal";
import { icons, images } from "@/constants/images";
import { colors } from "@/theme";

type AuthMode = "sign-up" | "sign-in";

// Sign in and sign up share one layout, only the copy (and the password field) change
const copy = {
  "sign-up": {
    title: "Create your account",
    subtitle: "Start your language journey today ✨",
    button: "Sign Up",
    footerText: "Already have an account? ",
    footerLink: "Log in",
    footerHref: "/sign-in",
  },
  "sign-in": {
    title: "Welcome back",
    subtitle: "Pick up where you left off 👋",
    button: "Sign In",
    footerText: "Don't have an account? ",
    footerLink: "Sign up",
    footerHref: "/sign-up",
  },
} as const;

const socialButtons = [
  { label: "Continue with Google", icon: icons.google, strategy: "oauth_google" },
  { label: "Continue with Facebook", icon: icons.facebook, strategy: "oauth_facebook" },
  { label: "Continue with Apple", icon: icons.apple, strategy: "oauth_apple" },
] as const;

type SocialStrategy = (typeof socialButtons)[number]["strategy"];

type ErrorMessage = { longMessage?: string; message: string } | null | undefined;

const messageOf = (error: ErrorMessage) => error?.longMessage ?? error?.message;

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const content = copy[mode];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [socialError, setSocialError] = useState<string>();
  const { signIn, errors: signInErrors } = useSignIn();
  const { signUp, errors: signUpErrors } = useSignUp();
  const { startSSOFlow } = useSSO();

  // Sign up: create the account, then Clerk emails a verification code.
  // Sign in: Clerk emails a one-time code to the existing account.
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSocialError(undefined);

    try {
      const emailAddress = email.trim();

      if (mode === "sign-up") {
        const { error } = await signUp.password({ emailAddress, password });
        if (error) return;

        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) return;
      } else {
        const { error } = await signIn.emailCode.sendCode({ emailAddress });
        if (error) return;
      }

      setVerifying(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Once the session is active, the root layout shows the home route
  const handleVerify = async (code: string) => {
    if (mode === "sign-up") {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) return;

      await signUp.finalize();
    } else {
      const { error } = await signIn.emailCode.verifyCode({ code });
      if (error) return;

      await signIn.finalize();
    }
  };

  // Clerk keeps the errors up to date: field errors show under the field, the rest under the button
  const errors = mode === "sign-up" ? signUpErrors : signInErrors;
  const emailError = messageOf(
    mode === "sign-up" ? signUpErrors.fields.emailAddress : signInErrors.fields.identifier,
  );
  const passwordError = mode === "sign-up" ? messageOf(signUpErrors.fields.password) : undefined;
  const codeError = messageOf(errors.fields.code);
  const formError = messageOf(errors.global?.[0]) ?? socialError;

  const handleSocial = async (strategy: SocialStrategy) => {
    if (submitting) return;
    setSubmitting(true);
    setSocialError(undefined);

    try {
      // When the sign in completes, Clerk activates the session and the root layout shows home
      const { createdSessionId, signIn: ssoSignIn, signUp: ssoSignUp } = await startSSOFlow({ strategy });

      // TEMPORARY diagnostics
      if (!createdSessionId) {
        const details = {
          signInStatus: ssoSignIn?.status,
          firstFactor: ssoSignIn?.firstFactorVerification?.status,
          firstFactorError: ssoSignIn?.firstFactorVerification?.error?.longMessage,
          signUpStatus: ssoSignUp?.status,
          missing: ssoSignUp?.missingFields,
          unverified: ssoSignUp?.unverifiedFields,
        };
        console.log("SSO result", JSON.stringify(details));
        setSocialError(JSON.stringify(details));
      }
    } catch (error) {
      setSocialError(error instanceof Error ? error.message : "Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-[30px]">
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="mt-3 h-10 w-10 justify-center"
          >
            <Image source={icons.chevronLeft} contentFit="contain" className="h-6 w-6" />
          </Pressable>

          {/* Heading */}
          <Text className="mt-5 font-poppins-bold text-[28px] leading-[38px] text-text-primary">
            {content.title}
          </Text>
          <Text className="mt-1 font-poppins text-base leading-6 text-[#5B6280]">
            {content.subtitle}
          </Text>

          {/* Mascot with sparkles */}
          <View className="mt-3 h-[132px] items-center">
            <View className="h-[132px] w-[206px] overflow-hidden">
              <Image
                source={images.mascotAuth}
                contentFit="contain"
                className="absolute -top-[37px] h-[206px] w-[206px]"
              />
            </View>
            <Text className="absolute top-3 left-[18%] text-[20px] text-streak">✦</Text>
            <Text className="absolute top-6 right-[18%] text-[16px] text-lingua-blue">✦</Text>
            <Text className="absolute top-[58px] right-[14%] text-[20px] text-warning">✦</Text>
          </View>

          {/* Form */}
          <View className="mt-2 gap-3.5">
            <View className={`auth__field ${emailError ? "auth__field--error" : ""}`}>
              <Text className="auth__label">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="alex@gmail.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                className="auth__input p-0"
              />
            </View>
            {emailError && <Text className="auth__error">{emailError}</Text>}

            {mode === "sign-up" && (
              <View className={`auth__field ${passwordError ? "auth__field--error" : ""}`}>
                <Text className="auth__label">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  underlineColorAndroid="transparent"
                  className="auth__input p-0 pr-10"
                />
                <Pressable
                  onPress={() => setShowPassword((value) => !value)}
                  hitSlop={12}
                  className="absolute right-6 self-center"
                >
                  <Image
                    source={showPassword ? icons.eyeOff : icons.eye}
                    contentFit="contain"
                    className="h-6 w-6"
                  />
                </Pressable>
              </View>
            )}
            {passwordError && <Text className="auth__error">{passwordError}</Text>}

            <Pressable
              onPress={handleSubmit}
              className="auth__submit mt-0.5 active:opacity-90"
            >
              <Text className="btn__label">{content.button}</Text>
            </Pressable>
            {formError && <Text className="auth__error text-center">{formError}</Text>}
            {/* Mount point for Clerk bot protection, it renders nothing visible */}
            {mode === "sign-up" && <View nativeID="clerk-captcha" />}
          </View>

          {/* Divider */}
          <View className="my-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Text className="font-poppins text-[15px] text-text-secondary">or continue with</Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Social */}
          <View className="gap-2">
            {socialButtons.map((button) => (
              <Pressable
                key={button.label}
                onPress={() => handleSocial(button.strategy)}
                className="auth__social active:opacity-80"
              >
                <Image source={button.icon} contentFit="contain" className="h-6 w-6" />
                <Text className="auth__social-label">{button.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="mt-auto flex-row justify-center pt-8 pb-6">
          <Text className="font-poppins text-[15px] text-[#5B6280]">{content.footerText}</Text>
          <Pressable onPress={() => router.replace(content.footerHref)} hitSlop={8}>
            <Text className="font-poppins-medium text-[15px] text-lingua-deep-purple">
              {content.footerLink}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <VerificationModal
        visible={verifying}
        email={email}
        error={codeError}
        onVerify={handleVerify}
        onClose={() => setVerifying(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1 },
});
