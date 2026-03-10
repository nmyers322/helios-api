import React from 'react';
import InformationPage from '../../styles/InformationPage';
import { PageTitle } from '../../styles/Page';
import styled from 'styled-components';

const TEMPLATE_BASE_URI = "/template-files";

const INSERT_ILLUSTRATOR_URI = `${TEMPLATE_BASE_URI}/Helios-Insert-ILLUSTRATOR.zip`;
const GATEFOLD_ILLUSTRATOR_URI = `${TEMPLATE_BASE_URI}/Helios-Gatefold-ILLUSTRATOR.zip`;
const JACKET_ILLUSTRATOR_URI = `${TEMPLATE_BASE_URI}/Helios-Jacket-ILLUSTRATOR.zip`;
const LP_CENTER_LABELS_ILLUSTRATOR_URI = `${TEMPLATE_BASE_URI}/Helios-LP-Center-Labels-ILLUSTRATOR.zip`;
const TRIPLE_GATEFOLD_ILLUSTRATOR_URI = `${TEMPLATE_BASE_URI}/Helios-Triple-Gatefold-ILLUSTRATOR.zip`;
const WIDE_SPINE_JACKET_ILLUSTRATOR_URI = `${TEMPLATE_BASE_URI}/Helios-Wide-Spine-Jacket-ILLUSTRATOR.zip`;

const INSERT_INDESIGN_URI = `${TEMPLATE_BASE_URI}/Helios-Insert-INDESIGN.zip`;
const GATEFOLD_INDESIGN_URI = `${TEMPLATE_BASE_URI}/Helios-Gatefold-INDESIGN.zip`;
const JACKET_INDESIGN_URI = `${TEMPLATE_BASE_URI}/Helios-Jacket-INDESIGN.zip`;
const LP_CENTER_LABELS_INDESIGN_URI = `${TEMPLATE_BASE_URI}/Helios-LP-Center-Labels-INDESIGN.zip`;
const TRIPLE_GATEFOLD_INDESIGN_URI = `${TEMPLATE_BASE_URI}/Helios-Triple-Gatefold-INDESIGN.zip`;
const WIDE_SPINE_JACKET_INDESIGN_URI = `${TEMPLATE_BASE_URI}/Helios-Wide-Spine-Jacket-INDESIGN.zip`;

const INSERT_PHOTOSHOP_URI = `${TEMPLATE_BASE_URI}/Helios-Insert-PHOTOSHOP.zip`;
const GATEFOLD_PHOTOSHOP_URI = `${TEMPLATE_BASE_URI}/Helios-Gatefold-PHOTOSHOP.zip`;
const JACKET_PHOTOSHOP_URI = `${TEMPLATE_BASE_URI}/Helios-Jacket-PHOTOSHOP.zip`;
const LP_CENTER_LABELS_PHOTOSHOP_URI = `${TEMPLATE_BASE_URI}/Helios-LP-Center-Labels-PHOTOSHOP.zip`;
const TRIPLE_GATEFOLD_PHOTOSHOP_URI = `${TEMPLATE_BASE_URI}/Helios-Triple-Gatefold-PHOTOSHOP.zip`;
const WIDE_SPINE_JACKET_PHOTOSHOP_URI = `${TEMPLATE_BASE_URI}/Helios-Wide-Spine-Jacket-PHOTOSHOP.zip`;

const ListTitle = styled.h4`
    padding-left: 2rem;
`;

const TemplatesPage = () => {
    return (
        <InformationPage>
            <PageTitle>Templates</PageTitle>
            <ListTitle>InDesign templates (most-preferred)</ListTitle>
            <ul>
                <li><a href={LP_CENTER_LABELS_INDESIGN_URI} download>Center Labels</a></li>
                <li><a href={INSERT_INDESIGN_URI} download>12"x12" Insert</a></li>
                <li><a href={JACKET_INDESIGN_URI} download>3mm Spine Standard Jacket</a></li>
                <li><a href={GATEFOLD_INDESIGN_URI} download>Gatefold Jacket</a></li>
                <li><a href={TRIPLE_GATEFOLD_INDESIGN_URI} download>Triple Gatefold Jacket</a></li>
                <li><a href={WIDE_SPINE_JACKET_INDESIGN_URI} download>5mm Wide Spine Jacket</a></li>
            </ul>
            <ListTitle>Illustrator templates</ListTitle>
            <ul>
                <li><a href={LP_CENTER_LABELS_ILLUSTRATOR_URI} download>Center Labels</a></li>
                <li><a href={INSERT_ILLUSTRATOR_URI} download>12"x12" Insert</a></li>
                <li><a href={JACKET_ILLUSTRATOR_URI} download>3mm Spine Standard Jacket</a></li>
                <li><a href={GATEFOLD_ILLUSTRATOR_URI} download>Gatefold Jacket</a></li>
                <li><a href={TRIPLE_GATEFOLD_ILLUSTRATOR_URI} download>Triple Gatefold Jacket</a></li>
                <li><a href={WIDE_SPINE_JACKET_ILLUSTRATOR_URI} download>5mm Wide Spine Jacket</a></li>
            </ul>
            <ListTitle>Photoshop templates (least-preferred)</ListTitle>
            <ul>
                <li><a href={LP_CENTER_LABELS_PHOTOSHOP_URI} download>Center Labels</a></li>
                <li><a href={INSERT_PHOTOSHOP_URI} download>12"x12" Insert</a></li>
                <li><a href={JACKET_PHOTOSHOP_URI} download>3mm Spine Standard Jacket</a></li>
                <li><a href={GATEFOLD_PHOTOSHOP_URI} download>Gatefold Jacket</a></li>
                <li><a href={TRIPLE_GATEFOLD_PHOTOSHOP_URI} download>Triple Gatefold Jacket</a></li>
                <li><a href={WIDE_SPINE_JACKET_PHOTOSHOP_URI} download>5mm Wide Spine Jacket</a></li>
            </ul>
        </InformationPage>
    );
};

export default TemplatesPage;