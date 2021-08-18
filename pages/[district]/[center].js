import Head from 'next/head'
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';
import { AppHeader } from '../../components/AppHeader';
import ReactMapGL, { Marker } from 'react-map-gl';
import { useEffect, useRef, useState } from 'react';
import useSize from '@react-hook/size';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyringe, faMap, faHashtag } from '@fortawesome/free-solid-svg-icons'
import { camelCase, upperFirst, truncate } from 'lodash';
import { AppFooter } from '../../components/AppFooter';
import { Disclaimer } from '../../components/Disclaimer';

export default function Center(props) {

  const mapRef = useRef(null)
  const [ width, height ] = useSize(mapRef);
  const t = useTranslations('Center');

  const { locale } = useRouter();
  const lprefix = locale == "en" ? "": `_${locale}`

  const startPoint = props.place;
  const [viewport, setViewport] = useState({
    width: width || "200px",
    height: height || "600px",
    latitude: parseFloat(startPoint.lat),
    longitude: parseFloat(startPoint.lng),
    zoom: 15
  });

  const hashtag =`VAXLK${upperFirst(camelCase(startPoint.district))}${upperFirst(camelCase(startPoint.center))}`

  useEffect(() => {
    if (width && height){
      setViewport((viewport) => ({
        ...viewport, 
        width: width,
        height: height
      }))
    }
  }, [width, height]);
  
  return (
    <>
      <Head>
        <title>{t('title', {center: startPoint[`center${lprefix}`]})}</title>
      </Head>
      <AppHeader sub={t("sub", {center: startPoint[`center${lprefix}`]})}/>
      <main className="md:flex md:gap-4 md:max-h-screen">
        <div className={"bg-gray-50 md:w-1/2 hidden md:block"}>
          <div ref={mapRef} className={"h-full"}>
            <ReactMapGL
              {...viewport}
              mapboxApiAccessToken={"pk.eyJ1IjoidWtyaHEiLCJhIjoiY2tzZmp5ODRqMWIwcjJ1bjV6cHZmNHV3ZiJ9.xEVN9z2chyXqe03alU2O1Q"}
              onViewportChange={nextViewport => setViewport(nextViewport)}
            >
              <Marker latitude={parseFloat(startPoint.lat)} longitude={parseFloat(startPoint.lng)}>
                <a className={"bg-yellow-50 bg-opacity-50 rounded-full h-24 w-24 flex flex-col items-center justify-center"}>
                  <div className="h-4 w-4">
                    <FontAwesomeIcon icon={faSyringe} color="red" />
                  </div>
                  <p className="text-xs font-medium text-center">{truncate(startPoint[`center${lprefix}`], { length: 15})}</p>
                </a>
              </Marker>
          </ReactMapGL>
          </div>
        </div>
        <div className="flex-grow md:w-1/2">
          <h3 className={"text-xl font-medium pb-2"}>{startPoint[`center${lprefix}`]}</h3>
          <div className="flex gap-2 pb-4">
            {startPoint.dose1 == "True" ? (
              <p className={"text-gray-600 text-sm px-2 italic border-2 rounded-full border-gray-600"}>{t('dose1')}</p>
            ): []}
            {startPoint.dose2 == "True" ? (
              <p className={"text-gray-600 text-sm px-2 italic border-2 rounded-full border-gray-600"}>{t('dose2')}</p>
            ): []}
          </div>
          <p className={"text-gray-600"}>
            <span className="font-medium">{t("district")}: </span> 
            {startPoint[`district${lprefix}`]}
          </p>
          <p className={"text-gray-600"}>
            <span className="font-medium">{t("police")}: </span> 
            {startPoint[`police${lprefix}`]}
          </p>
          <p className={"text-gray-600"}>
            <span className="font-medium">{t("address")}: </span> 
            {startPoint[`formatted_address${lprefix}`]}
          </p>
          <div className="pt-4 flex gap-2 flex-col md:flex-row">
            <a target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${startPoint.lat},${startPoint.lng}`}>
              <p className={"text-white text-sm px-4 py-2 rounded-full bg-green-400 flex gap-2"}>
                <div className="h-4 w-4">
                  <FontAwesomeIcon icon={faMap} color="white" />
                </div>
                <div>{t("maps")}</div>
              </p>
            </a>
            <a target="_blank" href={`https://twitter.com/search?q=%23${hashtag}&src=typed_query`}>
              <p className={"text-white text-sm px-4 py-2 rounded-full bg-blue-400 flex gap-2"}>
                <div className="h-4 w-4">
                  <FontAwesomeIcon icon={faHashtag} color="white" />
                </div>
                <div>{hashtag}</div>
              </p>
            </a>
          </div>
          <div className="mt-5"><Disclaimer /></div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}

export async function getStaticPaths() {

    const data = require("../../data/latest.json");

    const allPages = ["si", "ta", "en"]
      .map(locale => data.dataSet.map(item=> {
        return { 
          locale: locale,
          params: {
            district: item.district,
            center: item.center
          }
        }
      })).flat();

    return {
      paths: allPages,
      fallback: false,
    }
}

export function getStaticProps({locale, params}) {

  const data = require("../../data/latest.json");

  return {
    props: {
      district: params.district,
      center: params.center,
      place: data.dataSet.find(i => i.district === params.district && i.center === params.center),
      messages: {
        ...require(`../../lang/${locale}.json`),
      },
    }
  };
}