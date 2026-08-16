export const getOrdersOverviewViewState = ({
  fetching = false,
  orders = {},
  statuses = null,
  errorText = '',
} = {}) => {
  if (errorText) {
    return 'error'
  }

  const list = Object.keys(orders || {})
    .filter((id) => (statuses ? statuses.includes(orders[id]?.status) : true))
    .map((id) => orders[id])

  if (fetching && list.length === 0) {
    return 'loading'
  }
  if (list.length === 0) {
    return 'empty'
  }
  return 'ready'
}
