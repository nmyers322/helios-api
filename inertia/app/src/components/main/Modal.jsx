import styled from "styled-components";
import Button from "../form/main/Button";
import TertiaryButton from "../form/main/TertiaryButton";

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
`;

export const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.modalBackground};
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 .5rem .7rem rgba(0, 0, 0, 0.4);
  height: auto;
  max-height: calc(100% - 6rem);
  width: auto;
  max-width: calc(100vw - 6rem);
`;

export const ModalBody = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  height: 100%;
  width: 100%;
`;

export const ModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 40rem) {
    display: none;
  }
`;

export const ModalFooterSmall = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 40rem) {
    display: flex;
  }
`;

export const ModalConfirmButton = styled(Button)`
  && {
    font-size: 1rem;
    padding: 1rem;
  }
`;

export const ModalCancelButton = styled(TertiaryButton)`
  && {
    font-size: 1rem;
    padding: 1rem;
  }
`;

export const ModalButtonSpacer = styled.div`
  width: 1rem;
  height: 1rem;
`;

const Modal = ({
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  styles,
  title
}) => {
  return (
    <ModalBackdrop>
      <ModalContent style={styles}>
        { !!title && <h2>{title}</h2> }
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          { !!onCancel && <ModalCancelButton onClick={onCancel} buttonText={cancelText} /> }
          { !!onCancel && !!onConfirm && <ModalButtonSpacer /> }
          { !!onConfirm && <ModalConfirmButton onClick={onConfirm} buttonText={confirmText} /> }
        </ModalFooter>
        <ModalFooterSmall>
          { !!onConfirm && <ModalConfirmButton onClick={onConfirm} buttonText={confirmText} /> }
          { !!onCancel && <ModalCancelButton onClick={onCancel} buttonText={cancelText} /> }
        </ModalFooterSmall>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default Modal;