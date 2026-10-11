import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "@/theme";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  error?: string;
  onVerify: (code: string) => Promise<void>;
  onClose: () => void;
};

export function VerificationModal({ visible, email, error, onVerify, onClose }: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleChange = async (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);

    // Last digit entered: verify the code with Clerk
    if (digits.length === CODE_LENGTH && !verifying) {
      Keyboard.dismiss();
      setVerifying(true);
      await onVerify(digits);
      setVerifying(false);
      setCode("");
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View className="verify__backdrop">
          {/* Tapping outside the card closes the modal */}
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

          <View className="verify__card">
            <Text className="h2 text-center text-text-primary">Check your email</Text>
            <Text className="body-md text-center text-text-secondary">
              {`We sent a verification code to ${email.trim() || "your email"}. Enter the 6-digit code below.`}
            </Text>

            <View className="mt-4 h-14 flex-row gap-2">
              {Array.from({ length: CODE_LENGTH }, (_, index) => (
                <View
                  key={index}
                  className={`verify__box ${index === Math.min(code.length, CODE_LENGTH - 1) ? "verify__box--active" : ""}`}
                >
                  <Text className="h2 text-text-primary">{code[index] ?? ""}</Text>
                </View>
              ))}

              {/* Invisible input on top of the boxes: it receives the typing and the taps */}
              <TextInput
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={CODE_LENGTH}
                autoFocus
                caretHidden
                selectionColor={colors.linguaPurple}
                style={styles.hiddenInput}
              />
            </View>

            {error && <Text className="verify__error">{error}</Text>}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hiddenInput: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, opacity: 0.02, color: "transparent" },
});
