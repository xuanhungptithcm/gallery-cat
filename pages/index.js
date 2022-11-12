import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import logo from '../assets/logo/logo_transparent.png'
import FsLightbox from 'fslightbox-react';
import { useMemo, useState } from 'react';
const inter = Inter({
  weight: '400'
})

export default function Home(props) {
  const [listThumbnail, setListThumbnail] =  useState(props?.images?.results || [])
  const [toggler, setToggler] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);

  const myLoader = ({ src }) => {
    return `https://s3.us-east-2.amazonaws.com/daubap.tech/${src}`
  }

  const listSourceImageLarge = useMemo(() => {
    return listThumbnail?.map((image) => image.fileLocation)
  }, [listThumbnail])
  const handleSelectImage = (index) => {
    setSourceIndex(index)
  }
  return (
    <div className={inter.className}>
      <Head>
        <title>Đậu bắp</title>
        <meta name="description" content="Hình ảnh của đậu bắp" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <nav>
        <div className="logo">
          <Image src={logo} alt="logo"></Image>
        </div>
      </nav>
      <main className="main">
        <div className="container">
          <div className="images">
            {listThumbnail?.map((image, index) => {
              return (<Image key={image.id} loader={myLoader} src={image.name} alt={image?.name} width={image?.width} height={image.height} onClick={() => {
                setSourceIndex(index);
                setToggler(prev => !prev)
              }}/>)
            })}
          </div>
        </div>

        <FsLightbox
          sourceIndex={sourceIndex}
          type={"image"}
          toggler={toggler}
          sources={listSourceImageLarge}
          loadOnlyCurrentSource={true}
        />
      </main>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3001/v1/images?limit=10`)
  const images = await res.json()

  return { props: { images } }
}
