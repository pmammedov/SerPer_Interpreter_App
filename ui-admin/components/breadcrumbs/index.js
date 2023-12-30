import {useTranslation} from "next-i18next";


export const Breadcrumbs = ({components, page}) => {
    const {t} = useTranslation()
    return (
        <div className="mb-5">
            <ol className="flex font-semibold text-gray-500 dark:text-white-dark">
                <li className="before:relative before:-top-0.5 before:mx-4 before:inline-block before:h-1 before:w-1 before:rounded-full before:bg-primary">
                    <button className="hover:text-gray-500/70 dark:hover:text-white-dark/70">{t(`${components}`)}</button>
                </li>
                <li className="before:relative before:-top-0.5 before:mx-4 before:inline-block before:h-1 before:w-1 before:rounded-full before:bg-primary">
                    <button className="text-primary">{t(`${page}`)}</button>
                </li>
            </ol>
        </div>
    )
}
