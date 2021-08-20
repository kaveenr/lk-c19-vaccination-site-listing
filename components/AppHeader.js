import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';
import Head from 'next/head'

export const AppHeader = ({ sub }) => {

    const t = useTranslations('Header');
    const { locale, asPath } = useRouter();

    return (
        <header className="mt-2 md:mt-8 mb-8 text-center">
            <Head>
                <title>{sub ? sub: t("seoTitle")}</title>
                <meta name="title" content={sub ? sub: t("seoTitle")} />
                <meta name="description" content={t("seoDisc")}/>

                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://vax.covid.ukr.lk/"/>
                <meta property="og:title" content={sub ? sub: t("seoTitle")}/>
                <meta property="og:description" content={t("seoDisc")}/>
                <meta property="og:image" content={`https://vax.covid.ukr.lk/img/seo_${locale}.png`}/>

                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="twitter:url" content="https://vax.covid.ukr.lk/"/>
                <meta property="twitter:title" content={sub ? sub: t("seoTitle")}/>
                <meta property="twitter:description" content={t("seoDisc")}/>
                <meta property="twitter:image" content={`https://vax.covid.ukr.lk/img/seo_${locale}.png`}></meta>
            </Head>
            <Link href="/">
                <div>
                    <a className="md:text-3xl text-2xl font-bold text-pink-600">
                        <p className="mb-2">💉</p>
                        {t('title')} 
                    </a>
                </div>
            </Link>
            <p className="mt-3 md:text-2xl text-1xl italic text-gray-500">
                {sub ? sub: t('sub')} 
            </p>
            <div className="flex gap-2 justify-center py-4">
                <p>{t('lang')}:</p>
                <Link href={asPath} locale="si">
                    <a className={"hover:text-blue-600 text-blue-500 " + (locale == "si" ? "underline" : "")}>සිංහල</a>
                </Link>
                <Link href={asPath} locale="ta">
                    <a className={"hover:text-blue-600 text-blue-500 " + (locale == "ta" ? "underline" : "")}>தமிழ்</a>
                </Link>
                <Link href={asPath} locale="en">
                    <a className={"hover:text-blue-600 text-blue-500 " + (locale == "en" ? "underline" : "")}>English</a>
                </Link>
            </div>
        </header>
    );
}