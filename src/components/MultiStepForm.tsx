import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { defineStepper } from '@stepperize/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

const stripePromise = loadStripe('pk_test_51Qe50OGSPDCwljL7p0mjs3DRfREMsyatQJ6z0WnKWN0WggULYssUlN9Tv6KEIeNlBESNejGfzF4EshfjWFXQdvlm005heG4GPB');

const { Scoped, useStepper } = defineStepper(
  { id: 'personal-info', title: 'Personal Information' },
  { id: 'free-trial-agreement', title: 'Free Trial Agreement' },
  { id: 'connect', title: 'Connect with Us' }
);

interface MultiStepFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({ isOpen, onClose }) => {
  const stepper = useStepper();
  const [optInPayment, setOptInPayment] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const personalInfoFormRef = useRef<HTMLFormElement>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [numOfEmployees, setNumOfEmployees] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const handleNext = (formRef: React.RefObject<HTMLFormElement>) => {
    if (formRef.current && formRef.current.checkValidity()) {
      stepper.next();
    } else {
      formRef.current?.reportValidity();
    }
  };

  const handleRestart = () => {
    stepper.goTo('personal-info');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center p-4 border-b border-gray-200">
          <img src="portcullis.svg" alt="Company Logo" className="mb-4 w-16 h-16" />
          <DialogTitle className="text-2xl font-bold text-center">Get Started with Portcullis</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">Complete the steps to begin your journey</p>
        </DialogHeader>
        <Scoped>
          {stepper.switch({
            'personal-info': () => (
              <form ref={personalInfoFormRef} className="grid grid-cols-2 gap-4">
                <div>
                <Input
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                  <small className="text-gray-500">Enter your first name</small>
                </div>
                <div>
                  <Input placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  <small className="text-gray-500">Enter your last name</small>
                </div>
                <div>
                  <Input type="email" placeholder="Work Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <small className="text-gray-500">Enter your work email address</small>
                </div>
                <div>
                  <Input type="url" placeholder="LinkedIn Profile" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                  <small className="text-gray-500">Enter your LinkedIn profile URL</small>
                </div>
                <div>
                  <Input placeholder="Company Name" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  <small className="text-gray-500">Enter your company name</small>
                </div>
                <div>
                  <Input placeholder="Company Domain" required value={companyDomain} onChange={(e) => setCompanyDomain(e.target.value)}  />
                  <small className="text-gray-500">Enter your company domain</small>
                </div>
                <div>
                <Select value={numOfEmployees} onValueChange={setNumOfEmployees}>
                    <SelectTrigger>
                      <SelectValue placeholder="1-10 employees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-25">11-25 employees</SelectItem>
                      <SelectItem value="25-100">25-100 employees</SelectItem>
                      <SelectItem value="100-500">100-500 employees</SelectItem>
                      <SelectItem value="500+">More than 500 employees</SelectItem>
                    </SelectContent>
                  </Select>
                  <small className="text-gray-500">Enter your company size</small>
                </div>
                <div>
                  <Select value={annualRevenue} onValueChange={setAnnualRevenue}>
                  <SelectTrigger>
                    <SelectValue placeholder="$1M to $5M" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vc_funded">VC Funded</SelectItem>
                      <SelectItem value="less_than_1m">Less than $1M</SelectItem>
                      <SelectItem value="1m_to_5m">$1M to $5M</SelectItem>
                      <SelectItem value="5m_to_10m">$5M to $10M</SelectItem>
                      <SelectItem value="more_than_10m">More than $10M</SelectItem>
                    </SelectContent>
                  </Select>
                  <small className="text-gray-500">Enter your annual revenue</small>
                </div>
                <div className="col-span-2">
                  <Select value={referralSource} onValueChange={setReferralSource}>
                    <SelectTrigger>
                    <SelectValue placeholder="Exploring" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hackernews">Hacker News</SelectItem>
                      <SelectItem value="linkedin">Linkedin</SelectItem>
                      <SelectItem value="rands">Rands Leadership</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="friend">Personal acquaintance</SelectItem>
                    </SelectContent>
                  </Select>
                  <small className="text-gray-500">Where did you hear about us at?</small>
                </div>
                <div className="col-span-2 flex justify-between">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                  <Button onClick={() => handleNext(personalInfoFormRef)}>Next</Button>
                </div>
              </form>
            ),
            'free-trial-agreement': () => (
              <div className="flex flex-col gap-4">
                <ScrollArea className="h-64 border rounded p-4">
                  <h3 className="text-lg font-bold">FREE TRIAL AGREEMENT</h3>
                  <h4 className="text-md font-semibold mt-2">ENTER THE PORTCULLIS CORP TERMS AND CONDITIONS</h4>
                  <p className="mt-2">
                    This Free Trial Agreement (the "Agreement") is entered into between Enter the Portcullis Corp, a corporation organized and existing under the laws of [State/Country] with its principal place of business at [Address] (hereinafter referred to as the "Company") and the individual or entity that has requested access to the Company's services (hereinafter referred to as the "Client").
                  </p>
                  <h4>1. DEFINITIONS</h4>
                  <p>
                    <strong>1.1 "Services"</strong> means the consulting, analytics, and advisory services provided by the Company to the Client during the Free Trial Period.
                  </p>
                  <p>
                    <strong>1.2 "Free Trial Period"</strong> means the seven (7) calendar day period beginning on the date the Client first accesses the Services.
                  </p>
                  <p>
                    <strong>1.3 "Consultant"</strong> means any employee, contractor, or representative of the Company who provides Services to the Client.
                  </p>
                  <p>
                    <strong>1.4 "Communication Channels"</strong> means any method through which the Company communicates with the Client, including but not limited to email, telephone, video conferencing, messaging platforms, and in-person meetings.
                  </p>
                  <h4>2. FREE TRIAL SERVICES</h4>
                  <p>
                    <strong>2.1</strong> The Company agrees to provide the Client with access to the Services during the Free Trial Period at no cost to the Client.
                  </p>
                  <p>
                    <strong>2.2</strong> The Services provided during the Free Trial Period may be limited in scope and functionality compared to the full paid Services.
                  </p>
                  <p>
                    <strong>2.3</strong> The Company reserves the right to modify, suspend, or terminate the Free Trial services at any time without prior notice.
                  </p>
                  <h4>3. PAYMENT INFORMATION REQUIREMENT</h4>
                  <p>
                    <strong>3.1</strong> The Client acknowledges and agrees that within seven (7) calendar days from the commencement of the Free Trial Period, the Client must provide valid payment information to the Company to continue accessing the Services.
                  </p>
                  <p>
                    <strong>3.2</strong> If the Client fails to provide valid payment information within the specified timeframe, the Company reserves the right to:
                  </p>
                  <ul>
                    <li>a) Immediately terminate the Client's access to all Services;</li>
                    <li>b) Remove the Client from all Communication Channels; and</li>
                    <li>c) Cease all further communication with the Client.</li>
                  </ul>
                  <p>
                    <strong>3.3</strong> Provision of payment information does not automatically result in charges unless the Client explicitly agrees to convert to a paid subscription following the Free Trial Period.
                  </p>
                  <h4>4. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY</h4>
                  <p>
                    <strong>4.1</strong> ALL SERVICES PROVIDED DURING THE FREE TRIAL PERIOD ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>
                  <p>
                    <strong>4.2</strong> All insights, recommendations, advice, and information provided to the Client during the Free Trial Period represent the professional opinion of the individual Consultant providing such information and DO NOT represent the official position or opinion of the Company.
                  </p>
                  <p>
                    <strong>4.3</strong> By accepting this Agreement, the Client expressly agrees that all Services are being provided for informational purposes only, and the Client shall not hold the Company liable for any damages, losses, or negative consequences resulting from the Client's use of or reliance upon any information provided during the Free Trial Period.
                  </p>
                  <p>
                    <strong>4.4</strong> IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                  </p>
                  <p>
                    <strong>4.5</strong> The Client acknowledges that any business decisions made based on the Services are made at the Client's sole discretion and risk.
                  </p>
                  <h4>5. CONFIDENTIALITY</h4>
                  <p>
                    <strong>5.1</strong> During the Free Trial Period, the Client may receive confidential or proprietary information from the Company. The Client agrees to maintain the confidentiality of such information and not to disclose it to any third party without the Company's prior written consent.
                  </p>
                  <p>
                    <strong>5.2</strong> The Company agrees to maintain the confidentiality of any Client information shared during the Free Trial Period in accordance with the Company's Privacy Policy.
                  </p>
                  <h4>6. INTELLECTUAL PROPERTY</h4>
                  <p>
                    <strong>6.1</strong> All intellectual property rights, including but not limited to copyrights, trademarks, and trade secrets, in and to the Services and any materials provided to the Client during the Free Trial Period, remain the exclusive property of the Company.
                  </p>
                  <p>
                    <strong>6.2</strong> The Client is granted a limited, non-exclusive, non-transferable license to use the Services and materials solely for the purpose of evaluating the Services during the Free Trial Period.
                  </p>
                  <h4>7. TERM AND TERMINATION</h4>
                  <p>
                    <strong>7.1</strong> This Agreement commences on the date the Client first accesses the Services and continues until the end of the Free Trial Period, unless earlier terminated as provided herein.
                  </p>
                  <p>
                    <strong>7.2</strong> The Company may terminate this Agreement immediately and without notice if the Client breaches any provision of this Agreement.
                  </p>
                  <p>
                    <strong>7.3</strong> Upon termination of this Agreement, the Client shall cease all use of the Services and return or destroy all materials provided by the Company.
                  </p>
                  <h4>8. GOVERNING LAW AND JURISDICTION</h4>
                  <p>
                    <strong>8.1</strong> This Agreement shall be governed by and construed in accordance with the laws of [State/Country], without giving effect to any choice of law or conflict of law provisions.
                  </p>
                  <p>
                    <strong>8.2</strong> Any legal suit, action, or proceeding arising out of or related to this Agreement shall be instituted exclusively in the courts located in [City, State/Country], and each party irrevocably submits to the exclusive jurisdiction of such courts.
                  </p>
                  <h4>9. ENTIRE AGREEMENT</h4>
                  <p>
                    <strong>9.1</strong> This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements or communications.
                  </p>
                  <p>
                    <strong>9.2</strong> This Agreement may not be modified except in writing signed by both parties.
                  </p>
                </ScrollArea>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox 
                    id="terms-agreement" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <label htmlFor="terms-agreement" className="text-sm cursor-pointer">
                    I agree to the terms and conditions
                  </label>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={stepper.next} disabled={!agreedToTerms}>Next</Button>
                </div>
              </div>
            ),
          'connect': () => {
            const handleSlackInvite = async () => {
              try {
                const payload = {
                  email: email,
                  firstName: firstName,
                  lastName: lastName,
                  companyName: companyName,
                  companyDomain: companyDomain,
                  annualRevenue: annualRevenue,
                  numOfEmployees: numOfEmployees,
                  referralSource: referralSource
                  // Add more fields as needed
                };
                const response = await fetch('/api/client/invite', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (data.ok) {
                  window.location.href = `/success?invite_id=${data.invite_id}&channel_id=${data.channel_id}&email=${email}`; // Redirect to Slack workspace
                } else {
                  console.error('Error inviting to Slack:', data.error);
                  alert('Failed to invite to Slack. Please try again.');
                }
              } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
              }
            };

            return (
              <div className="flex flex-col gap-4 py-4">
                <Button variant="outline" className="w-full py-3" onClick={handleSlackInvite}>
                  Chat on Slack
                </Button>
                <div className="flex justify-end mt-4">
                  <Button onClick={onClose}>Finish</Button>
                </div>
              </div>
            );
          },
          })}
        </Scoped>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepForm;