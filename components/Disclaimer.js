import {useTranslations} from 'next-intl';
import useSize from '@react-hook/size';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export const Disclaimer = ({ sub }) => {

    const t = useTranslations('Disclaimer');

    return (
        <div className="p-4 bg-yellow-600 rounded-50">
            <span className="text-white flex gap-2">
                <div className="h-8 w-8">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
                <div>{t("data")}</div>
            </span>
        </div>
    );
}