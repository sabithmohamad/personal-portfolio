import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .contact-buttons-container {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px; /* Adjust the gap between buttons */
  }

  .contact-button {
    ${({ theme }) => theme.mixins.bigButton};
    display: flex;
    align-items: center;
    flex-direction: column; /* For icons above the text on larger screens */
    gap: 10px; /* Adjust the gap between icon and text */
  }

  /* Hide text on smaller screens */
  @media (max-width: 768px) {
    .contact-button .button-text {
      display: none; /* Hide the button text on mobile screens */
    }

    /* Adjust margins to display the buttons in the same line */
    .contact-buttons-container {
      margin-top: 30px;
    }
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What’s Next?</h2>

      <h2 className="title">Get In Touch</h2>

      <p>
        Although I’m not currently looking for any new opportunities, my inbox is always open.
        Whether you have a question or just want to say hi, I’ll try my best to get back to you!
      </p>

      <p>
        <strong> Qusais, Dubai, United Arab Emirates. </strong>
      </p>

      <div className="contact-buttons-container">
        {/* Use the common class for both buttons */}
        <a className="contact-button" href={`Tel:+971552428080`}>
          <FontAwesomeIcon icon={faPhoneAlt} />
          <span className="button-text">Say Hello</span>
        </a>

        <a className="contact-button" href={`mailto:${email}`}>
          <FontAwesomeIcon icon={faEnvelope} />
          <span className="button-text">Drop a Mail</span>
        </a>
      </div>
    </StyledContactSection>
  );
};

export default Contact;
