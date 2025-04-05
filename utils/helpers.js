module.exports = {
    generateJoinCode: () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
    
    isAdmin: (email) => {
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      return adminEmails.includes(email);
    }
  };