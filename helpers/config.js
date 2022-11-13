export const getS3Image = (S3_URL = process.env.NEXT_PUBLIC_S3_URL, BUCKET = process.env.NEXT_PUBLIC_BUCKET, fileName) => {
  return `${S3_URL}/${BUCKET}/${fileName}`
}

export const getBackendURL = () => {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_API}`
}