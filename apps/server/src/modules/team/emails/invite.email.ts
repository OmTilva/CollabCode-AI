export const inviteEmailTemplate = (teamName: string, inviteLink: string) => {
  return `
    <h2>You're invited to join ${teamName}</h2>

    <p>
      Click the link below to join:
    </p>

    <a href="${inviteLink}">
      Accept Invitation
    </a>

    <p>
      This invitation expires in 7 days.
    </p>
  `;
};
