import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { View } from 'react-native'
import {
  Appbar,
  Chip,
  List,
  ProgressBar,
  Surface,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper'

import { Database, Modal, Slug, TGroup, TPage, TPart, TQuarter } from '@/lib'

const ListHome = () => {
  const theme = useTheme()
  const db = useSQLiteContext()
  const { slug } = useLocalSearchParams<{ slug: Slug }>()
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [data, setData] = React.useState<
    TPart[] | TGroup[] | TQuarter[] | TPage[]
  >([])

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      setData(await Database.query(slug, db))

      setLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const title = slug[0].toUpperCase() + slug.slice(1)

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title,
          headerRight: (props) => (
            <Tooltip title="Info">
              <Appbar.Action
                {...props}
                icon="information"
                onPress={() => setVisible(true)}
              />
            </Tooltip>
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <AnimatedFlashList
        data={data}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.verse_content + '...'}
            descriptionNumberOfLines={1}
            onPress={() => router.push(`/${slug}/${item.id}`)}
            descriptionStyle={{
              direction: 'rtl',
              fontFamily: 'NotoKufiArabic_400Regular',
            }}
            left={(props) => (
              <Chip {...props}>
                {item.verse_c_id}:{item.verse_number}
              </Chip>
            )}
          />
        )}
      />

      <Modal
        theme={theme}
        title={slug[0].toUpperCase() + slug.slice(1)}
        modalProps={{
          visible,
          children: undefined,
          onDismiss: () => setVisible(false),
        }}
      >
        <View style={{ padding: 16 }}>
          <Text variant="bodyLarge">
            The holy Quran consists of {Database.count(slug)} {slug}, each of
            which varies in length and covers various aspects of guidance, laws,
            and stories. Each {slug.slice(0, slug.length - 1)} has a unique
            theme and message that contributes to the overall teachings of the
            Quran.{' '}
            {slug === 'parts'
              ? 'Each part consists of 2 groups.'
              : slug === 'groups'
                ? 'Each group consists of 4 quarters.'
                : slug === 'quarters'
                  ? 'Each quarter consists of multiple pages.'
                  : 'Each page consists of multiple verses.'}
          </Text>
        </View>
      </Modal>
    </Surface>
  )
}

export default ListHome
