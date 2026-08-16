let availablePackages = []

export const getAvailablePackages = () => availablePackages

export const setAvailablePackages = (packages) => {
  availablePackages = Array.isArray(packages) ? packages : []
}

export const getPackageBySlug = (slug) =>
  availablePackages.find((pressingPackage) => pressingPackage.slug === slug) || null
