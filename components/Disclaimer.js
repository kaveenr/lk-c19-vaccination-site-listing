import {useTranslations} from 'next-intl';
import useSize from '@react-hook/size';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export const Disclaimer = ({ sub }) => {

    const t = useTranslations('Disclaimer');

    return (
        <div className="p-4 bg-yellow-600 rounded-50">
            <span className="text-white">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                {'  '}
                {t("data")}
            </span>
        </div>
    );
}