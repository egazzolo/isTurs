import React, {useCallback, useState} from 'react';
import {RefreshControl} from 'react-native';

// Returns a RefreshControl to pass as `refreshControl` to a ScrollView or FlatList.
export default function usePullToRefresh(
  ...reloaders: Array<() => Promise<unknown>>
) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(reloaders.map(reload => reload()));
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, reloaders);
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
}
