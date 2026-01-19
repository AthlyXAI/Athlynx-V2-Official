/**
 * ATHLYNX AWS Services
 * Handles SES (Email) and SNS (SMS) integration
 * 
 * @author ATHLYNX AI Corporation
 * @date January 19, 2026
 */

import os
import boto3
import logging
import random
import string
from botocore.exceptions import ClientError

logger = logging.getLogger("athlynx-aws")

class AWSNotificationService:
    def __init__(self):
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.access_key = os.getenv("AWS_ACCESS_KEY_ID")
        self.secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        
        # Initialize clients
        self.ses = boto3.client(
            'ses',
            region_name=self.region,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key
        )
        
        self.sns = boto3.client(
            'sns',
            region_name=self.region,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key
        )
        
        self.sender_email = "noreply@athlynx.ai"
        # In-memory store for verification codes (use Redis in production)
        self.verification_codes = {}

    async def send_verification_email(self, email: str) -> str:
        """Generate code and send verification email"""
        code = ''.join(random.choices(string.digits, k=6))
        self.verification_codes[email] = code
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h1 style="color: #1a365d;">Welcome to ATHLYNX</h1>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2b6cb0; border-radius: 4px;">
                        {code}
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #718096;">
                        If you didn't request this code, please ignore this email.
                    </p>
                    <p style="font-size: 12px; color: #718096;">
                        &copy; 2026 ATHLYNX AI Corporation. All rights reserved.
                    </p>
                </div>
            </body>
        </html>
        """
        
        try:
            self.ses.send_email(
                Source=self.sender_email,
                Destination={'ToAddresses': [email]},
                Message={
                    'Subject': {'Data': 'ATHLYNX Verification Code'},
                    'Body': {'Html': {'Data': html_content}}
                }
            )
            logger.info(f"Verification email sent to {email}")
            return code
        except ClientError as e:
            logger.error(f"Failed to send email: {e}")
            # Fallback for dev/test if credentials fail
            logger.info(f"DEV MODE: Verification code for {email} is {code}")
            return code

    async def verify_code(self, email: str, code: str) -> bool:
        """Verify the provided code matches the stored one"""
        stored_code = self.verification_codes.get(email)
        if stored_code and stored_code == code:
            del self.verification_codes[email]
            return True
        return False

    async def send_welcome_email(self, email: str, position: int):
        """Send welcome email with waitlist position"""
        try:
            self.ses.send_email(
                Source=self.sender_email,
                Destination={'ToAddresses': [email]},
                Message={
                    'Subject': {'Data': 'Welcome to the ATHLYNX Waitlist! 🦁'},
                    'Body': {
                        'Html': {
                            'Data': f"""
                                <h1>You're on the list!</h1>
                                <p>Welcome to the future of athlete success.</p>
                                <p>Your current position: <strong>#{position}</strong></p>
                                <p>We'll notify you as soon as your spot opens up.</p>
                                <br>
                                <p>Dreams Do Come True 2026</p>
                            """
                        }
                    }
                }
            )
        except ClientError as e:
            logger.error(f"Failed to send welcome email: {e}")

    async def send_sms(self, phone_number: str, message: str):
        """Send SMS via AWS SNS"""
        try:
            self.sns.publish(
                PhoneNumber=phone_number,
                Message=message,
                MessageAttributes={
                    'AWS.SNS.SMS.SenderID': {
                        'DataType': 'String',
                        'StringValue': 'ATHLYNX'
                    }
                }
            )
        except ClientError as e:
            logger.error(f"Failed to send SMS: {e}")
