import InformationPage from "../../styles/InformationPage"
import { FloatRightImage } from "../../styles/LandingPage";
import enormousdoor from "../../images/enormousdoor.png";
import styled from "styled-components";
import { PageTitle } from "../../styles/Page";

const EnormousDoorImage = styled(FloatRightImage)`
    @media (max-width: 40rem) {
        width: 15rem;
        height: auto;
    }
`;

const MasteringPage = () => {
    return (
        <InformationPage>
            <PageTitle>Vinyl Mastering</PageTitle>
            <p><EnormousDoorImage src={enormousdoor} />It is crucially important that your music is properly mastered for vinyl before submitting it for production. The physical aspects of the lacquer cutting and vinyl playback process mean that mastering requires careful attention to a number of constraints and technical details.<br /><br />
            Mastering is also the last opportunity to correct mistakes and imbalances, optimizing your mix so that it sounds as good as it possibly can.<br /><br />
            Enormous Door Mastering has worked with thousands of artists to create high-quality masters that establish a deep and impactful connection with listeners, ensuring that your mixes translate accurately across all formats and environments and that your pressing projects meet proper technical specifications to ensure problem-free outcomes.<br /><br />
            You can learn more at <a href="https://enormousdoor.com" rel="noreferrer noopener" target="_blank">Enormous Door Mastering (enormousdoor.com)</a>.</p>
        </InformationPage>
    );
};

export default MasteringPage;