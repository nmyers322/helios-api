import { useDispatch, useSelector } from "react-redux";
import { setPrintContent, setShowPrintModal } from "../../actions/metaActions";
import PrintableOrderSummary from "../standalone/PrintableOrderSummary";
import { ModalBackdrop, ModalBody, ModalContent } from "./Modal";
import RedXButton from "../form/main/RedXButton";
import Button from "../form/main/Button";
import styled from "styled-components";
import generatePDF from 'react-to-pdf';
import { useRef } from "react";

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1rem;
`;

export const Item = styled.div`
    max-width: 30rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    `;

const PrintBody = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: calc(100%);
    max-height: calc(100vh - 12rem);
    overflow-y: scroll;
    overflow-x: scroll;
    
    max-width: calc(100vw - 6rem);
    padding: 0rem;
`;

const PrintModal = ({
    styles
}) => {
    const dispatch = useDispatch();
    const showPrintModal = useSelector((state) => state.meta.showPrintModal);
    const printContent = useSelector((state) => state.meta.printContent);
    const timestamp = Date.now();
    const targetRef = useRef(null);

    const handleClose = () => {
        dispatch(setShowPrintModal(false));
        dispatch(setPrintContent(""));
    };
    
    if (!showPrintModal) {
        return null;
    }

    return (
        <ModalBackdrop>
            <ModalContent style={styles}>
                <ModalBody>
                    <Row>
                        <Item>
                            <Button 
                                buttonText={"Print"}
                                onClick={
                                    () => {
                                        generatePDF(targetRef, {filename: `${printContent?.orderId || printContent}-${timestamp}.pdf`});
                                        handleClose();
                                    }
                                }
                                styles={{
                                    marginTop: "0"
                                }} />
                        </Item>
                        <Item>
                            <RedXButton onClick={handleClose} />
                        </Item>
                    </Row>
                    <PrintBody>
                        { printContent?.orderId && <PrintableOrderSummary orderId={printContent.orderId} targetRef={targetRef} /> }

                        { printContent === "orderSummary" && <PrintableOrderSummary targetRef={targetRef} /> }
                    </PrintBody>
                    
                </ModalBody>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default PrintModal;