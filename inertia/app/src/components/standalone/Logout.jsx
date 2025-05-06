import { useNavigate } from "react-router-dom";
import { deleteToken } from "../../modules/heliosApi";
import { useGoTo } from "../../modules/links";
import { setActiveTokenStatus } from "../../actions/customerActions";
import { setLocalToken } from "../../actions/metaActions";
import { useDispatch } from "react-redux";

export const Logout = () => {
    const goTo = useGoTo(useNavigate());
    const dispatch = useDispatch();
    const handleLogout = async () => {
        await deleteToken();
        dispatch(setActiveTokenStatus(false));
        dispatch(setLocalToken(null));
        goTo("/login?success=logout", {});
    };
    handleLogout();
    return <></>;
}

export default Logout;