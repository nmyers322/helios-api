import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderFormField } from '../../actions/orderFormActions';
import { ViewOnMobileOnly } from '../../styles/Page';
import { onCheckoutPage } from '../../modules/routes';
import { selectShippingRate } from '../../actions/cartActions';

const ShippingCost = ({source="shippingOptions", output="name"}) => {
    const orderForm = useSelector((state) => state.orderForm);
    const shippingOptions = useSelector((state) => state.shippingOptions.shippingOptions);
    const selectedShippingOption = useSelector((state) => state.shippingOptions.selectedOption);
    const dispatch = useDispatch();
    const checkoutPage = onCheckoutPage();
    const [showHelpMsg, setShowHelpMsg] = useState(false);

    useEffect(() => {
        if (checkoutPage) {
            setShowHelpMsg(true);
        }
    }, [checkoutPage]);

    const getName = () => {
        return shippingOptions.find(option => option.id === selectedShippingOption)?.name || "";
    }
    const getPrice = () => {
        return shippingOptions.find(option => option.id === selectedShippingOption)?.price || "";
    }
    return (
        <div>
            { source === "orderForm" && 
                ( orderForm.shippingCost 
                    ? ("$" + orderForm.shippingCost )
                    : "Not yet calculated" )
            }
            { source === "shippingOptions" &&
                <div>
                    { output === "name" && getName() }
                    { output === "price" && getPrice() }
                </div>
            }
            { showHelpMsg && <ViewOnMobileOnly>(Select option below)</ViewOnMobileOnly> }
        </div>
    );
}

export default ShippingCost;