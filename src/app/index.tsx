import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";
import { colors } from "@/theme";

type Swatch = { name: string; hex: string; bg: string };

// Class names are written in full so Tailwind can detect them
const colorGroups: { title: string; swatches: Swatch[] }[] = [
  {
    title: "PRIMARY",
    swatches: [
      { name: "LINGUA PURPLE", hex: colors.linguaPurple, bg: "bg-lingua-purple" },
      { name: "LINGUA DEEP PURPLE", hex: colors.linguaDeepPurple, bg: "bg-lingua-deep-purple" },
      { name: "LINGUA BLUE", hex: colors.linguaBlue, bg: "bg-lingua-blue" },
      { name: "LINGUA GREEN", hex: colors.linguaGreen, bg: "bg-lingua-green" },
    ],
  },
  {
    title: "SEMANTIC",
    swatches: [
      { name: "SUCCESS", hex: colors.success, bg: "bg-success" },
      { name: "WARNING", hex: colors.warning, bg: "bg-warning" },
      { name: "STREAK", hex: colors.streak, bg: "bg-streak" },
      { name: "ERROR", hex: colors.error, bg: "bg-error" },
      { name: "INFO", hex: colors.info, bg: "bg-info" },
    ],
  },
  {
    title: "NEUTRALS",
    swatches: [
      { name: "TEXT / PRIMARY", hex: colors.textPrimary, bg: "bg-text-primary" },
      { name: "TEXT / SECONDARY", hex: colors.textSecondary, bg: "bg-text-secondary" },
      { name: "BORDER", hex: colors.border, bg: "bg-border" },
      { name: "SURFACE", hex: colors.surface, bg: "bg-surface" },
      { name: "BACKGROUND", hex: colors.background, bg: "bg-background border border-border" },
    ],
  },
];

const typeScale = [
  { label: "H1", use: "Page / Screen Title", spec: "32px · Bold · 1.2", style: "h1" },
  { label: "H2", use: "Section Title", spec: "24px · SemiBold · 1.3", style: "h2" },
  { label: "H3", use: "Card / Module Title", spec: "20px · SemiBold · 1.3", style: "h3" },
  { label: "H4", use: "Subheading", spec: "16px · Medium · 1.4", style: "h4" },
  { label: "Body Large", use: "Important content", spec: "16px · Regular · 1.6", style: "body-lg" },
  { label: "Body Medium", use: "Body text", spec: "14px · Regular · 1.6", style: "body-md" },
  { label: "Body Small", use: "Supporting text", spec: "13px · Regular · 1.6", style: "body-sm" },
  { label: "Caption", use: "Labels, meta text", spec: "11px · Regular · 1.4", style: "caption" },
];

function SectionTitle({ children }: { children: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <Text className="h3 text-lingua-deep-purple">{children}</Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}

export default function DesignSystem() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Link href="/onboarding" asChild>
          <Pressable className="btn btn--primary active:opacity-90">
            <Text className="btn__label">Open onboarding</Text>
            <View className="btn__chevron" />
          </Pressable>
        </Link>

        <View className="gap-4 rounded-3xl border border-border bg-background p-5">
          <SectionTitle>BRAND</SectionTitle>
          <View className="flex-row items-center justify-center gap-2 py-2">
            <Image source={images.mascotLogo} contentFit="contain" className="h-24 w-24" />
            <Text className="h1 text-text-primary" style={styles.wordmark}>
              lingua
            </Text>
          </View>
        </View>

        <View className="gap-5 rounded-3xl border border-border bg-background p-5">
          <SectionTitle>COLORS</SectionTitle>
          {colorGroups.map((group) => (
            <View key={group.title} className="gap-3">
              <Text className="font-poppins-medium text-[13px] text-text-secondary">
                {group.title}
              </Text>
              <View className="flex-row flex-wrap gap-x-4 gap-y-4">
                {group.swatches.map((swatch) => (
                  <View key={swatch.name} className="w-24 gap-1">
                    <View className={`h-16 w-full rounded-xl ${swatch.bg}`} />
                    <Text className="font-poppins-medium text-[11px] text-text-secondary">
                      {swatch.name}
                    </Text>
                    <Text className="caption text-text-secondary">{swatch.hex}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View className="gap-5 rounded-3xl border border-border bg-background p-5">
          <SectionTitle>TYPOGRAPHY</SectionTitle>
          <View className="gap-1">
            <Text className="font-poppins-medium text-[13px] text-text-secondary">FONT FAMILY</Text>
            <Text className="text-text-primary" style={styles.fontSample}>
              Poppins
            </Text>
            <Text className="body-md text-text-secondary">
              Poppins is a modern, geometric sans-serif typeface that provides excellent
              readability and a friendly personality.
            </Text>
          </View>
          {typeScale.map((row) => (
            <View key={row.label} className="gap-1 border-t border-border pt-4">
              <Text className={`${row.style} text-text-primary`}>{row.label}</Text>
              <Text className="caption text-text-secondary">
                {row.use} · {row.spec}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  content: { gap: 16, padding: 16 },
  // Brand wordmark and font sample are display sizes outside the type scale
  wordmark: { fontSize: 64, lineHeight: 76 },
  fontSample: { fontFamily: "Poppins-SemiBold", fontSize: 56, lineHeight: 68 },
});
