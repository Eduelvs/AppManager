import { ScrollView, Text, View } from 'react-native';

const PICKS = [
  { id: '1', title: 'Recomendado para você', subtitle: 'Baseado no que você lê' },
  { id: '2', title: 'Tendências em Mobile', subtitle: 'Os assuntos mais quentes' },
  { id: '3', title: 'Continue lendo', subtitle: 'De onde você parou' },
];

export default function ForYouScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-4 gap-3">
      <Text className="mb-2 text-3xl font-bold text-foreground">For You</Text>
      {PICKS.map((item) => (
        <View key={item.id} className="rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-lg font-medium text-foreground">{item.title}</Text>
          <Text className="mt-1 text-sm text-grey">{item.subtitle}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
