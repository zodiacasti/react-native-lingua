import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";
import { colors } from "@/theme";

export default function Onboarding() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Brand */}
      <View className="flex-row items-center justify-center pt-1">
        <Image source={images.mascotLogo} contentFit="contain" className="h-20 w-20" />
        <Text className="font-poppins-semibold text-[32px] leading-10 text-text-primary">
          muolingo
        </Text>
      </View>

      {/* Headline */}
      <View className="mt-4 px-9">
        <Text
          className="h1 text-[34px] leading-[46px] text-text-primary"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Your AI language
        </Text>
        <Text className="h1 text-[34px] leading-[46px] text-text-primary" numberOfLines={1}>
          <Text className="text-lingua-deep-purple">teacher</Text>.
        </Text>
        <Text className="body-lg mt-3 max-w-[300px] leading-8 text-text-secondary">
          Real conversations, personalized lessons, anytime, anywhere.
        </Text>
      </View>

      {/* Mascot with speech bubbles */}
      <View className="mt-4 flex-1">
        <Image
          source={images.mascotWelcome}
          contentFit="contain"
          contentPosition="center"
          className="absolute inset-0"
        />

        <View className="onboarding__bubble top-9 left-[10%] -rotate-6 bg-[#EAF3FF]">
          <Text className="onboarding__bubble-text text-text-primary">Hello!</Text>
        </View>
        <View className="onboarding__bubble top-1 right-[12%] -rotate-6 bg-[#F1F2FF]">
          <Text className="onboarding__bubble-text text-[#3D3FE0]">¡Hola!</Text>
        </View>
        <View className="onboarding__bubble top-[110px] right-[6%] -rotate-6 bg-[#FDEEE9]">
          <Text className="onboarding__bubble-text text-[#E5483A]">你好!</Text>
        </View>
      </View>

      {/* Call to action */}
      <View className="px-7 pt-6 pb-4">
        <Pressable
          onPress={() => router.push("/sign-up")}
          className="btn btn--primary active:opacity-90"
        >
          <Text className="btn__label">Get Started</Text>
          <View className="btn__chevron" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
});
