// PrivacyPolicy.jsx
import React, { useState, useEffect } from 'react';
import '../assets/styles/pages/PrivacyPolicy.scss';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  // Scroll to section when clicking on table of contents link
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView(true);

    }
  };

  useEffect(() => {
    scrollToSection("start")
  },[])
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.policy-section');
      let currentActive = null;

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        
        if (sectionTop < window.innerHeight / 3) {
          currentActive = section.id;
        }
      });

      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="privacy-policy-container" id='start'>
      <div className="privacy-policy-content">
        <h1>PRIVACY NOTICE</h1>
        
        <div className="last-updated">
          Last updated April 03, 2025
        </div>
        
        <div className="policy-intro">
          <p>
            This Privacy Notice for HHQTV ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal
            information when you use our services ("Services"), including when you:
          </p>
          
          <p className="questions-concerns">
            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your 
            personal information is processed. If you do not agree with our policies and practices, please do not use our Services.
          </p>
        </div>
        
        <div className="policy-section" id="summary">
          <h2>SUMMARY OF KEY POINTS</h2>
          
          <p className="italic">
            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point 
            or by using our <span className="link" onClick={() => scrollToSection('toc')}>table of contents</span> below to find the section you are looking for.
          </p>
          
          <div className="key-points">
            <p>
              <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us 
              and the Services, the choices you make, and the products and features you use. Learn more about <span className="link" onClick={() => scrollToSection('collect')}>personal information you disclose to us</span>.
            </p>
            
            <p>
              <strong>Do we process any sensitive personal information?</strong> Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial 
              or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.
            </p>
            
            <p>
              <strong>Do we collect any information from third parties?</strong> We may collect information from public databases, marketing partners, social media platforms, and other outside 
              sources. Learn more about <span className="link" onClick={() => scrollToSection('collect')}>information collected from other sources</span>.
            </p>
            
            <p>
              <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud 
              prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid 
              legal reason to do so. Learn more about <span className="link" onClick={() => scrollToSection('process')}>how we process your information</span>.
            </p>
            
            <p>
              <strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties. Learn 
              more about <span className="link" onClick={() => scrollToSection('share')}>when and with whom we share your personal information</span>.
            </p>
            
            <p>
              <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal 
              information. Learn more about <span className="link" onClick={() => scrollToSection('rights')}>your privacy rights</span>.
            </p>
            
            <p>
              <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting a <span className="link">data subject access request</span>, or by contacting us. We will consider and act 
              upon any request in accordance with applicable data protection laws.
            </p>
            
            <p>
              Want to learn more about what we do with any information we collect? <span className="link" onClick={() => scrollToSection('toc')}>Review the Privacy Notice in full</span>.
            </p>
          </div>
        </div>
        
        <div className="policy-section" id="toc">
          <h2>TABLE OF CONTENTS</h2>
          
          <ol className="toc-list">
            <li><span className="link" onClick={() => scrollToSection('collect')}>WHAT INFORMATION DO WE COLLECT?</span></li>
            <li><span className="link" onClick={() => scrollToSection('process')}>HOW DO WE PROCESS YOUR INFORMATION?</span></li>
            <li><span className="link" onClick={() => scrollToSection('share')}>WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</span></li>
            <li><span className="link" onClick={() => scrollToSection('cookies')}>DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</span></li>
            <li><span className="link" onClick={() => scrollToSection('social')}>HOW DO WE HANDLE YOUR SOCIAL LOGINS?</span></li>
            <li><span className="link" onClick={() => scrollToSection('international')}>IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</span></li>
            <li><span className="link" onClick={() => scrollToSection('retention')}>HOW LONG DO WE KEEP YOUR INFORMATION?</span></li>
            <li><span className="link" onClick={() => scrollToSection('minors')}>DO WE COLLECT INFORMATION FROM MINORS?</span></li>
            <li><span className="link" onClick={() => scrollToSection('rights')}>WHAT ARE YOUR PRIVACY RIGHTS?</span></li>
            <li><span className="link" onClick={() => scrollToSection('dnt')}>CONTROLS FOR DO-NOT-TRACK FEATURES</span></li>
            <li><span className="link" onClick={() => scrollToSection('updates')}>DO WE MAKE UPDATES TO THIS NOTICE?</span></li>
            <li><span className="link" onClick={() => scrollToSection('contact')}>HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</span></li>
            <li><span className="link" onClick={() => scrollToSection('review')}>HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</span></li>
          </ol>
        </div>
        
        <div className="policy-section" id="collect">
          <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
          
          <h3>Personal information you disclose to us</h3>
          
          <p className="in-short">
            <em>In Short:</em> We collect personal information that you provide to us.
          </p>
          
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products 
            and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </p>
          
          <p>
            <strong>Sensitive Information.</strong> We do not process sensitive information.
          </p>
          
          <p>
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
          </p>
          
          <h3>Information automatically collected</h3>
          
          <p className="in-short">
            <em>In Short:</em> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our 
            Services.
          </p>
          
          <p>
            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact 
            information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, 
            referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily 
            needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
          </p>
          
          <p>
            Like many businesses, we also collect information through cookies and similar technologies.
          </p>
        </div>
        
        <div className="policy-section" id="process">
          <h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          
          <p className="in-short">
            <em>In Short:</em> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. 
            We may also process your information for other purposes with your consent.
          </p>
          
          <p>
            We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
          </p>
        </div>
        
        <div className="policy-section" id="share">
          <h2>3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
          
          <p className="in-short">
            <em>In Short:</em> We may share information in specific situations described in this section and/or with the following third parties.
          </p>
          
          <p>
            We may need to share your personal information in the following situations:
          </p>
          
          <ul>
            <li>
              <strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or 
              acquisition of all or a portion of our business to another company.
            </li>
            <li>
              <strong>Affiliates.</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Notice. Affiliates include our parent 
              company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.
            </li>
            <li>
              <strong>Business Partners.</strong> We may share your information with our business partners to offer you certain products, services, or promotions.
            </li>
          </ul>
        </div>
        
        <div className="policy-section" id="cookies">
          <h2>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          
          <p className="in-short">
            <em>In Short:</em> We may use cookies and other tracking technologies to collect and store your information.
          </p>
          
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking 
            technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
          </p>
          
          <p>
            We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display 
            advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third 
            parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or 
            on other websites.
          </p>
          
          <p>
            Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </p>
        </div>
        
        <div className="policy-section" id="social">
          <h2>5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
          
          <p className="in-short">
            <em>In Short:</em> If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.
          </p>
          
          <p>
            Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, 
            we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider 
            concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social 
            media platform.
          </p>
          
          <p>
            We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. 
            Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you 
            review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and 
            apps.
          </p>
        </div>
        
        <div className="policy-section" id="international">
          <h2>6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</h2>
          
          <p className="in-short">
            <em>In Short:</em> We may transfer, store, and process your information in countries other than your own.
          </p>
          
          <p>
            Our servers are located in. If you are accessing our Services from outside, please be aware that your information may be transferred to, stored by, and processed by us in 
            our facilities and in the facilities of the third parties with whom we may share your personal information (see "WHEN AND WITH WHOM DO WE SHARE YOUR 
            PERSONAL INFORMATION?" above), in and other countries.
          </p>
          
          <p>
            If you are a resident in the European Economic Area (EEA), United Kingdom (UK), or Switzerland, then these countries may not necessarily have data protection laws or 
            other similar laws as comprehensive as those in your country. However, we will take all necessary measures to protect your personal information in accordance with this 
            Privacy Notice and applicable law.
          </p>
        </div>
        
        <div className="policy-section" id="retention">
          <h2>7. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          
          <p className="in-short">
            <em>In Short:</em> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
          </p>
          
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or 
            permitted by law (such as tax, accounting, or other legal requirements).
          </p>
          
          <p>
            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible 
            (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further 
            processing until deletion is possible.
          </p>
        </div>
        
        <div className="policy-section" id="minors">
          <h2>8. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          
          <p className="in-short">
            <em>In Short:</em> We do not knowingly collect data from or market to children under 18 years of age.
          </p>
          
          <p>
            We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you 
            represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that 
            personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such 
            data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at _________.
          </p>
        </div>
        
        <div className="policy-section" id="rights">
          <h2>9. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          
          <p className="in-short">
            <em>In Short:</em> You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.
          </p>
          
          <p>
            <strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the 
            applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in 
            the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.
          </p>
          
          <p>
            However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your 
            personal information conducted in reliance on lawful processing grounds other than consent.
          </p>
          
          <h3>Account Information</h3>
          
          <p>
            If you would at any time like to review or change the information in your account or terminate your account, you can:
            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some 
            information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
          </p>
        </div>
        
        <div className="policy-section" id="dnt">
          <h2>10. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          
          <p>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy 
            preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing 
            DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not 
            to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy 
            Notice.
          </p>
        </div>
        
        <div className="policy-section" id="updates">
          <h2>11. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          
          <p className="in-short">
            <em>In Short:</em> Yes, we will update this notice as necessary to stay compliant with relevant laws.
          </p>
          
          <p>
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make 
            material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage 
            you to review this Privacy Notice frequently to be informed of how we are protecting your information.
          </p>
        </div>
        
        <div className="policy-section" id="contact">
          <h2>12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          
          <p>
            If you have questions or comments about this notice, you may contact us by post at:
          </p>
          
          <div className="contact-address">
            <p>__________</p>
            <p>__________</p>
            <p>__________</p>
          </div>
        </div>
        
        <div className="policy-section" id="review">
          <h2>13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
          
          <p>
            Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have 
            processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal 
            information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and 
            submit a <span className="link">data subject access request</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;