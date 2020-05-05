const snapshotStatus = [

]

function getByType(type) {
  return snapshotStatus.filter(item => item.type === type)
}

export { snapshotStatus, getByType }
