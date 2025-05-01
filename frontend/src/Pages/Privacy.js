import React from 'react';
import { Container, Row, Col, Accordion, Card, Table, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="mb-4">Privacy Policy</h1>
          <p className="text-muted">Last updated: April 17, 2025</p>

          <p>
            This Privacy Notice for <strong>Outlands</strong> ("we," "us," or "our") describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
          </p>
          <ListGroup className="mb-4">
            <ListGroup.Item>Visit our website, or any website of ours that links to this Privacy Notice</ListGroup.Item>
            <ListGroup.Item>Download and use our mobile application, or any other application of ours that links to this Privacy Notice</ListGroup.Item>
            <ListGroup.Item>Engage with us in other related ways, including any sales, marketing, or events</ListGroup.Item>
          </ListGroup>

          <p>
            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
            <a href="mailto:outlandscontacts@gmail.com">outlandscontacts@gmail.com</a>.
          </p>

          <h2 className="mt-5">Summary of Key Points</h2>
          <p>
            This summary provides key points from our Privacy Notice. You can find more details about any of these topics by using the links below or by navigating to the relevant section in the{' '}
            <a href="#toc">Table of Contents</a>.
          </p>
          <Accordion className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>What personal information do we process?</Accordion.Header>
              <Accordion.Body>
                When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.{' '}
                <a href="#infocollect">Learn more</a>.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Do we process any sensitive personal information?</Accordion.Header>
              <Accordion.Body>
                We do not process sensitive personal information such as racial or ethnic origins, sexual orientation, or religious beliefs.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Do we collect any information from third parties?</Accordion.Header>
              <Accordion.Body>
                We do not collect any information from third parties.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>How do we process your information?</Accordion.Header>
              <Accordion.Body>
                We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.{' '}
                <a href="#infouse">Learn more</a>.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>In what situations and with which parties do we share personal information?</Accordion.Header>
              <Accordion.Body>
                We may share information in specific situations and with specific third parties.{' '}
                <a href="#whoshare">Learn more</a>.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>How do we keep your information safe?</Accordion.Header>
              <Accordion.Body>
                We have organizational and technical processes and procedures in place to protect your personal information.{' '}
                <a href="#infosafe">Learn more</a>.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="6">
              <Accordion.Header>What are your rights?</Accordion.Header>
              <Accordion.Body>
                Depending on where you are located geographically, you may have certain rights regarding your personal information.{' '}
                <a href="#privacyrights">Learn more</a>.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="7">
              <Accordion.Header>How do you exercise your rights?</Accordion.Header>
              <Accordion.Body>
                The easiest way to exercise your rights is by submitting a{' '}
                <a href="https://app.termly.io/notify/ef009af5-d8e7-4f42-94bd-6cb72a8b757c">data subject access request</a>, or by contacting us.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <h2 id="toc" className="mt-5">Table of Contents</h2>
          <ListGroup className="mb-4">
            <ListGroup.Item><a href="#infocollect">1. What Information Do We Collect?</a></ListGroup.Item>
            <ListGroup.Item><a href="#infouse">2. How Do We Process Your Information?</a></ListGroup.Item>
            <ListGroup.Item><a href="#legalbases">3. What Legal Bases Do We Rely On to Process Your Personal Information?</a></ListGroup.Item>
            <ListGroup.Item><a href="#whoshare">4. When and With Whom Do We Share Your Personal Information?</a></ListGroup.Item>
            <ListGroup.Item><a href="#inforetain">5. How Long Do We Keep Your Information?</a></ListGroup.Item>
            <ListGroup.Item><a href="#infosafe">6. How Do We Keep Your Information Safe?</a></ListGroup.Item>
            <ListGroup.Item><a href="#privacyrights">7. What Are Your Privacy Rights?</a></ListGroup.Item>
            <ListGroup.Item><a href="#DNT">8. Controls for Do-Not-Track Features</a></ListGroup.Item>
            <ListGroup.Item><a href="#uslaws">9. Do United States Residents Have Specific Privacy Rights?</a></ListGroup.Item>
            <ListGroup.Item><a href="#otherlaws">10. Do Other Regions Have Specific Privacy Rights?</a></ListGroup.Item>
            <ListGroup.Item><a href="#policyupdates">11. Do We Make Updates to This Notice?</a></ListGroup.Item>
            <ListGroup.Item><a href="#contact">12. How Can You Contact Us About This Notice?</a></ListGroup.Item>
            
          </ListGroup>

          <h2 id="infocollect" className="mt-5">1. What Information Do We Collect?</h2>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Personal Information You Disclose to Us</Card.Title>
              <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, participate in activities on the Services, or otherwise when you contact us.</p>
              <p>The personal information we collect may include:</p>
              <ListGroup>
                <ListGroup.Item>Email addresses</ListGroup.Item>
                <ListGroup.Item>Passwords</ListGroup.Item>
                <ListGroup.Item>Debit/credit card numbers</ListGroup.Item>
                <ListGroup.Item>Contact or authentication data</ListGroup.Item>
                <ListGroup.Item>Mailing addresses</ListGroup.Item>
              </ListGroup>
              <p className="mt-3"><strong>Sensitive Information:</strong> We do not process sensitive information.</p>
              <p><strong>Payment Data:</strong> We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number and security code. All payment data is handled and stored by our payment processor (details to be provided).</p>
            </Card.Body>
          </Card>

          <h2 id="infouse" className="mt-5">2. How Do We Process Your Information?</h2>
          <p>We process your personal information to:</p>
          <ListGroup className="mb-4">
            <ListGroup.Item>Facilitate account creation and authentication</ListGroup.Item>
            <ListGroup.Item>Respond to user inquiries and offer support</ListGroup.Item>
            <ListGroup.Item>Fulfill and manage your orders, payments, returns, and exchanges</ListGroup.Item>
            <ListGroup.Item>Enable user-to-user communications</ListGroup.Item>
            <ListGroup.Item>Request feedback</ListGroup.Item>
            <ListGroup.Item>Send marketing and promotional communications (with your consent)</ListGroup.Item>
            <ListGroup.Item>Protect our Services, including fraud monitoring and prevention</ListGroup.Item>
            <ListGroup.Item>Identify usage trends to improve our Services</ListGroup.Item>
            <ListGroup.Item>Save or protect an individual's vital interest</ListGroup.Item>
          </ListGroup>

          <h2 id="legalbases" className="mt-5">3. What Legal Bases Do We Rely On to Process Your Personal Information?</h2>
          <p>We process your personal information based on:</p>
          <ListGroup className="mb-4">
            <ListGroup.Item><strong>Consent:</strong> With your permission for specific purposes (withdrawable at any time).</ListGroup.Item>
            <ListGroup.Item><strong>Performance of a Contract:</strong> To fulfill contractual obligations, including providing our Services.</ListGroup.Item>
            <ListGroup.Item><strong>Legitimate Interests:</strong> For purposes like marketing, analytics, fraud prevention, and improving user experience.</ListGroup.Item>
            <ListGroup.Item><strong>Legal Obligations:</strong> To comply with legal requirements or litigation.</ListGroup.Item>
            <ListGroup.Item><strong>Vital Interests:</strong> To protect your or others' safety.</ListGroup.Item>
          </ListGroup>
          <p>For Canada residents, we rely on express or implied consent, or process without consent in exceptional cases like fraud prevention or legal compliance.</p>

          <h2 id="whoshare" className="mt-5">4. When and With Whom Do We Share Your Personal Information?</h2>
          <p>We may share your information in the following situations:</p>
          <ListGroup className="mb-4">
            <ListGroup.Item><strong>Business Transfers:</strong> During mergers, sales, or acquisitions.</ListGroup.Item>
            <ListGroup.Item><strong>Affiliates:</strong> With our parent company, subsidiaries, or commonly controlled entities.</ListGroup.Item>
            <ListGroup.Item><strong>Business Partners:</strong> To offer products, services, or promotions.</ListGroup.Item>
          </ListGroup>

          <h2 id="inforetain" className="mt-5">5. How Long Do We Keep Your Information?</h2>
          <p>We keep your personal information only as long as necessary for the purposes outlined in this Privacy Notice, or as required by law. We delete or anonymize it when no longer needed, except for data in backup archives, which is securely stored until deletion is possible.</p>

          <h2 id="infosafe" className="mt-5">6. How Do We Keep Your Information Safe?</h2>
          <p>We implement reasonable technical and organizational security measures to protect your personal information. However, no system is 100% secure, and transmission of data to and from our Services is at your own risk.</p>

          <h2 id="privacyrights" className="mt-5">7. What Are Your Privacy Rights?</h2>
          <p>Depending on your location (e.g., EEA, UK, Switzerland, Canada), you may have rights to:</p>
          <ListGroup className="mb-4">
            <ListGroup.Item>Access and obtain a copy of your personal information</ListGroup.Item>
            <ListGroup.Item>Request rectification or erasure</ListGroup.Item>
            <ListGroup.Item>Restrict or object to processing</ListGroup.Item>
            <ListGroup.Item>Data portability</ListGroup.Item>
            <ListGroup.Item>Not be subject to automated decision-making</ListGroup.Item>
          </ListGroup>
          <p>
            To exercise these rights, submit a{' '}
            <a href="https://app.termly.io/notify/ef009af5-d8e7-4f42-94bd-6cb72a8b757c">data subject access request</a> or contact us at{' '}
            <a href="mailto:outlandscontacts@gmail.com">outlandscontacts@gmail.com</a>.
          </p>
          <p><strong>Account Information:</strong> You can review, update, or terminate your account via account settings. Upon termination, we will deactivate or delete your data, retaining some for legal purposes.</p>

          <h2 id="DNT" className="mt-5">8. Controls for Do-Not-Track Features</h2>
          <p>We do not currently respond to Do-Not-Track (DNT) signals, as no uniform standard exists. California law requires us to disclose this, and we will update our practices if a standard is adopted.</p>

          <h2 id="uslaws" className="mt-5">9. Do United States Residents Have Specific Privacy Rights?</h2>
          <p>Residents of certain US states (e.g., California, Colorado, Connecticut, etc.) may have rights to:</p>
          <ListGroup className="mb-4">
            <ListGroup.Item>Know, access, correct, or delete personal data</ListGroup.Item>
            <ListGroup.Item>Obtain a copy of personal data</ListGroup.Item>
            <ListGroup.Item>Opt out of targeted advertising, data sales, or profiling</ListGroup.Item>
            <ListGroup.Item>Non-discrimination for exercising rights</ListGroup.Item>
          </ListGroup>
          <p><strong>Categories of Personal Information We Collect:</strong></p>
          <Table striped bordered hover className="mb-4">
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Collected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A. Identifiers</td>
                <td>Contact details, email address, account name</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>B. Personal information (California Customer Records)</td>
                <td>Name, contact information, financial information</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>C. Protected classification characteristics</td>
                <td>Gender, age, race, marital status</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>D. Commercial information</td>
                <td>Transaction information, purchase history</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>E. Biometric information</td>
                <td>Fingerprints, voiceprints</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>F. Internet or network activity</td>
                <td>Browsing history, search history</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>G. Geolocation data</td>
                <td>Device location</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>H. Audio, electronic, sensory information</td>
                <td>Images, audio, video recordings</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>I. Professional or employment-related information</td>
                <td>Job title, work history</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>J. Education Information</td>
                <td>Student records</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>K. Inferences</td>
                <td>Preferences, characteristics</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>L. Sensitive personal Information</td>
                <td>-</td>
                <td>NO</td>
              </tr>
            </tbody>
          </Table>
          <p>
            To exercise your rights, submit a{' '}
            <a href="https://app.termly.io/notify/ef009af5-d8e7-4f42-94bd-6cb72a8b757c">data subject access request</a> or email{' '}
            <a href="mailto:outlandscontacts@gmail.com">outlandscontacts@gmail.com</a>.
          </p>
          <p><strong>California "Shine The Light" Law:</strong> California residents can request information about personal data shared for direct marketing purposes.</p>

          <h2 id="otherlaws" className="mt-5">10. Do Other Regions Have Specific Privacy Rights?</h2>
          <p><strong>Australia and New Zealand:</strong> Under the Privacy Acts, you have rights to access or correct your personal information. Contact us to exercise these rights. Complaints can be filed with the Office of the Australian Information Commissioner or New Zealand Privacy Commissioner.</p>
          <p><strong>South Africa:</strong> You have rights to access or correct your personal information. Complaints can be filed with the Information Regulator (South Africa).</p>

          <h2 id="policyupdates" className="mt-5">11. Do We Make Updates to This Notice?</h2>
          <p>We may update this Privacy Notice, with changes indicated by a revised date. Material changes will be prominently posted or directly notified.</p>

          <h2 id="contact" className="mt-5">12. How Can You Contact Us About This Notice?</h2>
          <p>
            Email us at <a href="mailto:outlandscontacts@gmail.com">outlandscontacts@gmail.com</a> or contact us by post at:
          </p>
          <address>
            Outlands<br />
            Estonia
          </address>

          
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;