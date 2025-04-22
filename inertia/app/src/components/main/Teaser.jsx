import React from 'react';
import styled from 'styled-components';
import warehouseImage from '../../images/warehouse-outside.jpg';
import './Teaser.css';

const TeaserContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-around;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  position: relative;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${warehouseImage});
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  z-index: 0;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
  }
`;

const TeaserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  z-index: 1;
`;

function TeaserContent() {
    return (
        <div className="Teaser">
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"></link>
            <p className="text comingsoon">COMING SOON!</p>
            <div className="youtube">
                <iframe className="youtube-iframe" src="https://www.youtube.com/embed/sBKJBxLLzc8?si=oE0eHvgaBHXBDH6v&amp;start=10" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <p className="text">We are proud to announce a new venture called Helios Press, a record pressing plant currently under construction and opening later this year in Brady, TX. Up to this point, we have relied entirely on our personal savings to finance this enormous project. We are now running a fundraiser campaign to raise the necessary capital to finish the factory.  <a href="https://shop.nwnprod.com/index.php?route=product/category&path=102">Please go here to pledge your support!</a></p>
        </div>
  );
}

const Teaser = () => {
  return (
    <TeaserContainer>
      <BackgroundImage />
      <TeaserWrapper>
        <TeaserContent />
      </TeaserWrapper>
    </TeaserContainer>
  );
}

export default Teaser;