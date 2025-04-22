import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderFormField } from '../../actions/orderFormActions';
import { ViewOnMobileOnly } from '../../styles/Page';
import { onCheckoutPage } from '../../modules/routes';
import { selectShippingRate } from '../../actions/cartActions';

const ShippingCost = ({source="orderForm"}) => {
    const orderForm = useSelector((state) => state.orderForm);
    const dispatch = useDispatch();
    const checkoutPage = onCheckoutPage();
    const [showHelpMsg, setShowHelpMsg] = useState(false);

    useEffect(() => {
        if (checkoutPage) {
            setShowHelpMsg(true);
        }
    }, [checkoutPage]);

    useEffect(() => {
        const targetNode = document.querySelector('#shipping-option');
        const updateShippingCost = () => {
            const selectedOptionPrice = document.querySelector('#shipping-option .wc-block-components-radio-control__option-checked .wc-block-components-radio-control__secondary-label > span');
            if (selectedOptionPrice) {
                dispatch(updateOrderFormField("shippingCost", selectedOptionPrice.textContent.replace('$', '').replace(',', '').replace('Free', '0')));
            }
            const selectedOptionId = document.querySelector('#shipping-option .wc-block-components-radio-control__option-checked');
            if (selectedOptionId) {
                dispatch(selectShippingRate(selectedOptionId.getAttribute('for').replace('radio-control-0-', '')));
            }
        };
        const handleClick = (event) => {
            const radio = event.target.closest('input[type="radio"]');
            if (radio) {
                updateShippingCost();
            }
        };

        if (targetNode) {
            targetNode.addEventListener('click', handleClick);

            updateShippingCost();

            return () => {
                targetNode.removeEventListener('click', handleClick);
            };
        }
    }, [dispatch]);

    return (
        <div>
            { source === "orderForm" && 
                ( orderForm.shippingCost 
                    ? ("$" + orderForm.shippingCost )
                    : "Not yet calculated" )
            }
            { showHelpMsg && <ViewOnMobileOnly>(Select option below)</ViewOnMobileOnly> }
        </div>
    );
}

export default ShippingCost;