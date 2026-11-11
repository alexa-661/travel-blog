import { useState } from "react";

const isValidEmail = (email: string) =>
{
   const trimmedEmail = email.trim();
   const atIndex = trimmedEmail.indexOf('@');

   //check for a single @ sign. 
   if (atIndex <= 0 || atIndex !== trimmedEmail.lastIndexOf('@'))
   {
      return false;
   }

   const localPart = trimmedEmail.slice(0, atIndex);
   const domain = trimmedEmail.slice(atIndex + 1);
   const localParts = localPart.split('.');

   if (localPart.length > 64 || !domain.includes('.'))
   {
      return false;
   }

   if (localParts.some((part) => !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+$/.test(part)))
   {
      return false;
   }

   if (!/^[\p{L}\p{N}.-]+$/u.test(domain))
   {
      return false;
   }

   const domainParts = domain.split('.');
   if (domainParts.some((part) => !/^[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?$/u.test(part)))
   {
      return false;
   }

   let asciiDomain: string;
   try
   {
      asciiDomain = new URL(`http://${domain}`).hostname;
   }
   catch
   {
      return false;
   }

   if (localPart.length + asciiDomain.length + 1 > 254 || asciiDomain.length > 253)
   {
      return false;
   }

   return asciiDomain.split('.').every((part) =>
      part.length <= 63 && /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(part)
   );
};

const ContactPage = () => {
   const [name, setName] = useState('');
   const [nameIsInvalid, setNameIsInvalid] = useState(false);
   const [email, setEmail] = useState('');
   const [emailIsInvalid, setEmailIsInvalid] = useState(false);
   const [message, setMessage] = useState('');
   const [messageIsInvalid, setMessageIsInvalid] = useState(false);
   const [warningMessage, setWarningMessage] = useState('');
   const [submissionSuccess, setSubmissionSuccess] = useState(false);

   const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
   {
      setName(event.target.value);
      setNameIsInvalid(false);
      setSubmissionSuccess(false);
   }

   const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
   {
      setEmail(event.target.value);
      setEmailIsInvalid(false);
      setSubmissionSuccess(false);
   }  

   const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
   {
      setMessage(event.target.value);
      setMessageIsInvalid(false);
      setSubmissionSuccess(false);
   }

   const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) =>
   {
      event.preventDefault();

      const nameIsInvalid = !/^[a-zA-Z\s]+$/.test(name.trim());
      const emailIsInvalid = !isValidEmail(email);
      const messageIsInvalid = !/^[a-zA-Z0-9\s.,!?"'-]+$/.test(message.trim());

      setNameIsInvalid(nameIsInvalid);
      setEmailIsInvalid(emailIsInvalid);
      setMessageIsInvalid(messageIsInvalid);

      if (nameIsInvalid)
      {
         setWarningMessage(name.trim() ? 'Name can only contain letters and spaces.' : 'Please enter your name.');
      }
      else if (emailIsInvalid)
      {
         setWarningMessage('Please enter a valid email address.');
      }
      else if (messageIsInvalid)
      {
         setWarningMessage(message.trim() ? 'Message can only contain letters, numbers, spaces, and basic punctuation.' : 'Please enter a message.');
      }
      else
      {
         //add code for submission here. 
         setSubmissionSuccess(true);
         setWarningMessage('');
         try
         {
            const response = await fetch('/api/contact', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json', 
               },
               body: JSON.stringify({ name, email, message }),

            });

            if (!response.ok)
            {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            else
            {
               setSubmissionSuccess(true);
               setName('');
               setEmail('');
               setMessage('');
            }
         }
         catch (error)
         {
            console.error('Error submitting contact form:', error);
            setWarningMessage('An error occurred while submitting the form. Please try again.');
         }
      }
   };

   return (
      <div>
         <p style={{textAlign: 'left'}}>Questions, comments, or feedback are welcome! Note that no abuse will be tolerated. After all, this is <u>my</u> blog.</p>
         <form
            noValidate
            onSubmit={onSubmitHandler}
            style={{
               display: 'grid',
               gridTemplateColumns: '7rem minmax(0, 1fr)',
               gap: '1rem',
               maxWidth: '40rem',
               textAlign: 'left',
               margin: '0 auto',
            }}
         >
            <label htmlFor="name" style={{marginRight: '1rem'}}>Name:</label>
            <input
               type="text"
               id="name"
               name="name"
               required
               onChange={handleNameChange}
               value={name}
               aria-invalid={nameIsInvalid}
               style={
                  {
                     color: nameIsInvalid ? "red" : undefined,
                     borderColor: nameIsInvalid ? "red" : undefined
                  }
               }
            />
            <label htmlFor="email" style={{marginRight: '1rem'}}>Email:</label>
            <input
               type="email"
               id="email"
               name="email"
               required
               onChange={handleEmailChange}
               value={email}
               aria-invalid={emailIsInvalid}
               style={
                  {
                     color: emailIsInvalid ? "red" : undefined,
                     borderColor: emailIsInvalid ? "red" : undefined
                  }
               }
            />
            <label htmlFor="message" style={{marginRight: '1rem'}}>Message:</label>
            <textarea
               id="message"
               name="message"
               required
               rows={6}
               onChange={handleMessageChange}
               value={message}
               aria-invalid={messageIsInvalid}
               style={
                  {
                     color: messageIsInvalid ? "red" : undefined,
                     borderColor: messageIsInvalid ? "red" : undefined
                  }
               }
            ></textarea>
            <input
               type="submit"
               value="Send"
               style={{ gridColumn: '2', justifySelf: 'end' }}
            />
            <div
               role="status"
               aria-live="polite"
               style={{
                  gridColumn: '1 / -1',
                  minHeight: '1.25rem',
                  color: 'red',
                  textAlign: 'right',
                  fontSize: '0.875rem',
                  display: warningMessage ? 'block' : 'none',
               }}
            >
               {warningMessage}
            </div>
            <div
               role="status"
               style={{
                  gridColumn: '1 / -1',
                  minHeight: '1.25rem',
                  color: 'green',
                  textAlign: 'right',
                  fontSize: '0.875rem',
                  display: submissionSuccess ? 'block' : 'none',
               }}
            >
               Your message has been sent.
            </div>
         </form>
      </div>
   )
};

export default ContactPage;