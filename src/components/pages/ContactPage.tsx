const Contact = () => {
   return (
      <div>
         <p style={{textAlign: 'left'}}>Questions, comments, or feedback are welcome! Note that no abuse will be tolerated. After all, this is <u>my</u> blog.</p>
         <form style={{
            display: 'grid',
            gridTemplateColumns: '7rem minmax(0, 1fr)',
            gap: '1rem',
            maxWidth: '40rem',
            textAlign: 'left',
            margin: '0 auto',
         }}
         >
            <label htmlFor="name" style={{marginRight: '1rem'}}>Name:</label>
            <input type="text" id="name" name="name" required />
            <label htmlFor="email" style={{marginRight: '1rem'}}>Email:</label>
            <input type="email" id="email" name="email" required/>
            <label htmlFor="message" style={{marginRight: '1rem'}}>Message:</label>
            <textarea id="message" name="message" required ></textarea>
            <input
               type="submit"
               value="Send"
               style={{ gridColumn: '2', justifySelf: 'end' }}
            />
         </form>
      </div>
   )
};

export default Contact;