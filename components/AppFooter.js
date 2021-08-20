import {useTranslations, useIntl} from 'next-intl';

export const AppFooter = () => {

    const t = useTranslations('Footer');
    const intl = useIntl();

    return (
        <footer className="my-8 text-center">
            <p className="mt-3">
                {t("lastUpdated", {date: intl.formatDateTime(new Date(),  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })})}
            </p>
            <a target="_blank" href="https://github.com/nuuuwan" className="mt-3 text-sm hover:text-blue-600 text-blue-500">
                {t("dataBy")}
            </a>{' '}
            <a target="_blank" href="https://github.com/kaveenr/lk-c19-vaccination-site-listing/graphs/contributors" 
                className="mt-3 text-sm hover:text-blue-600 text-blue-500">
                {t("applicationBy")}
            </a>
        </footer>
    );
}