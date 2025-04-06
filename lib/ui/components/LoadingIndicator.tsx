import React from 'react'
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  Surface,
} from 'react-native-paper'

const LoadingIndicator = (props: ActivityIndicatorProps) => (
  <Surface
    elevation={0}
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 96,
    }}
  >
    <ActivityIndicator {...props} />
  </Surface>
)

export default LoadingIndicator
