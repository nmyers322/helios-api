import { useNavigate } from "react-router-dom";
import { deleteToken } from "../../modules/heliosApi";
import { useGoTo } from "../../modules/links";

export const Logout = () => {
    const goTo = useGoTo(useNavigate());
    const handleLogout = async () => {
        await deleteToken();
        goTo("/login?success=logout", {});
    };
    handleLogout();
    return <></>;
}

export default Logout;