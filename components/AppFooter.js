import Link from 'next/link';
import {useTranslations, useIntl} from 'next-intl';
import {useRouter} from 'next/router';


export const AppFooter = () => {

    const t = useTranslations('Footer');
    const intl = useIntl();

    return (
        <footer className="py-4 text-center">
            <p className="mt-3">
                {t("lastUpdated", {date: intl.formatDateTime(new Date())})}
            </p>
        </footer>
    );
}