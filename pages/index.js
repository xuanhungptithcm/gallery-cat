import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import logo from '../assets/logo/logo_transparent.png'
import FsLightbox from 'fslightbox-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getBackendURL, getS3Image } from '../helpers/config';
import OptimizeImage from '../components/Image';
const inter = Inter({
  weight: '400'
})

export default function Home(props) {
  const [listThumbnail, setListThumbnail] = useState(props?.images?.results || [])
  const [toggler, setToggler] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1); // storing current page number
  const [prevPage, setPrevPage] = useState(0); // storing prev page number
  const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list
  const [lastList, setLastList] = useState(false);





  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${getBackendURL()}/images?limit=10&page=${currPage}`
      );
      const images = await response.json();
      if (!images?.results?.length) {
        setLastList(true);
        return;
      }
      setPrevPage(currPage);
      setListThumbnail([...listThumbnail, ...images?.results]);
    };
    if (!lastList && prevPage !== currPage) {
      fetchData();
    }
  }, [currPage, lastList, prevPage, listThumbnail]);

  const listSourceImageLarge = useMemo(() => {
    return listThumbnail?.map((image) => image.fileLocation)
  }, [listThumbnail])

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        setCurrPage(currPage + 1);
      }
    }
  };
  return (
    <div className={inter.className} >
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

      <main className="main" ref={listInnerRef} onScroll={onScroll}>
        <div className="container">
          <div className="images"

          >
            {listThumbnail?.map((image, index) => {
              return (
                <OptimizeImage key={image.id} image={image} index={index} setSourceIndex={setSourceIndex} setToggler={setToggler} />
              )
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
  return { props: { images: [] } }
}
