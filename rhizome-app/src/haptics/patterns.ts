import * as Haptics from 'expo-haptics';

export async function dropImpact() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function heavyRain() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export async function rippleExpand() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
