import 'react-native';
import 'react-native-safe-area-context';

declare global {
  const process: {
    env: Record<string, string | undefined>;
  };
}

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface TextInputProps {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
  }

  interface TouchableOpacityProps {
    className?: string;
  }

  interface PressableProps {
    className?: string;
  }

  interface KeyboardAvoidingViewProps {
    className?: string;
  }
}

declare module 'react-native-safe-area-context' {
  interface SafeAreaViewProps {
    className?: string;
  }
}

export {};
