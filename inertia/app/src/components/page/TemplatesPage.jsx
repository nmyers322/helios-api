import React from 'react';
import InformationPage from '../../styles/InformationPage';
import { PageTitle } from '../../styles/Page';
import styled from 'styled-components';

const TEMPLATE_BASE_URI = "/template-files";

const templateUri = (fileName) => `${TEMPLATE_BASE_URI}/${encodeURIComponent(fileName)}`;

const TEMPLATE_TYPES = [
    { label: 'Center Labels', baseName: 'Helios LP Center Labels' },
    { label: '12"x12" Insert', baseName: 'Helios Insert' },
    { label: '3mm Spine Standard Jacket', baseName: 'Helios Jacket' },
    { label: 'Gatefold Jacket', baseName: 'Helios Gatefold' },
    { label: 'Triple Gatefold Jacket', baseName: 'Helios Triple Gatefold' },
    { label: '5mm Wide Spine Jacket', baseName: 'Helios Wide Spine Jacket' },
];

const TEMPLATE_FORMATS = [
    { title: 'InDesign templates (most-preferred)', format: 'INDESIGN' },
    { title: 'Illustrator templates', format: 'ILLUSTRATOR' },
    { title: 'Photoshop templates (least-preferred)', format: 'PHOTOSHOP' },
];

const ListTitle = styled.h4`
    padding-left: 2rem;
`;

const TemplatesPage = () => {
    return (
        <InformationPage>
            <PageTitle>Templates</PageTitle>
            {TEMPLATE_FORMATS.map(({ title, format }) => (
                <React.Fragment key={format}>
                    <ListTitle>{title}</ListTitle>
                    <ul>
                        {TEMPLATE_TYPES.map(({ label, baseName }) => {
                            const fileName = `${baseName} ${format}.zip`;
                            return (
                                <li key={fileName}>
                                    <a href={templateUri(fileName)} download>{label}</a>
                                </li>
                            );
                        })}
                    </ul>
                </React.Fragment>
            ))}
        </InformationPage>
    );
};

export default TemplatesPage;