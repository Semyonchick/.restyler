function requireAll (requireContext) {
  return requireContext.keys().map(requireContext)
}

requireAll(require.context('../icons', false, /\.svg$/))