import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';


export const AppHeader = ({ sub }) => {

    const t = useTranslations('Header');
    const { locale, asPath } = useRouter();

    return (
        <header className="mt-16 mb-8 text-center">
            <Link href="/">
                <a className="md:text-3xl text-2xl font-bold text-pink-600">
                    {t('title')} 
                </a>
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