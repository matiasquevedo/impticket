const formattedTime = (s) => {
  const hours = Math.floor(s / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const seconds = (s % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export default formattedTime;