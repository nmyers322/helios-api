import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLocal, isTest } from "../../modules/environment";
import { EmptyDiv } from "../../styles/Page";
import { StyledSubLink } from "./DropdownMenu";
import { setIsBeta } from "../../actions/metaActions";

const BetaFeaturesLink = ({
  LinkClass = StyledSubLink,
  styles
}) => {
    const dispatch = useDispatch();
    const isBeta = useSelector((state) => state.meta.isBeta);
  const [cheatCodeActivated, setCheatCodeActivated] = useState(isLocal() || isTest());

  useEffect(() => {
    const cheatCode = {
      keys: [],
      cheatCode: ['ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'],
    };
    const keyListener = (e) => {
      cheatCode.keys.push(e.key);
      if (cheatCode.keys.length > cheatCode.cheatCode.length) {
        cheatCode.keys.shift();
      }
      if (cheatCode.keys.join('') === cheatCode.cheatCode.join('')) {
        setCheatCodeActivated(true);
      }
    }
    window.addEventListener('keydown', keyListener);
    return () => {
      window.removeEventListener('keydown', keyListener);
    }
  }, []);

  return (
    (cheatCodeActivated || isBeta || window.location.hash.includes("#testme")) ? (
        <LinkClass
          onClick={() => {
            dispatch(setIsBeta(!isBeta));
          }}
          style={styles}>
          { isBeta ? "Disable" : "Enable" } Beta Features
        </LinkClass>
    ) : <EmptyDiv />
  );
}

export default BetaFeaturesLink;