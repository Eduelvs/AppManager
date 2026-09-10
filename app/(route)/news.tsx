import { ScrollView, Text, View } from 'react-native';

const NEWS = [
  { id: '1', title: 'Expo Router chega com Native Tabs', tag: 'Tech' },
  { id: '2', title: 'NativeWind 4 melhora estilos no RN', tag: 'Dev' },
  { id: '3', title: 'React Native 0.86 lançado', tag: 'Mobile' },
  { id: '4', title: 'Novidades do SDK 57 do Expo', tag: 'Expo' },
];

export default function NewsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-4 gap-3">
      <Text className="mb-2 text-3xl font-bold text-foreground">News</Text>
      {NEWS.map((item) => (
        <View key={item.id} className="rounded-2xl bg-card p-4 shadow-sm">
          <Text className="mb-1 text-xs font-semibold uppercase text-primary">{item.tag}</Text>
          <Text className="text-lg font-medium text-foreground">{item.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
