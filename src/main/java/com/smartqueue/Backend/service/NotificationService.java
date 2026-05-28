package com.smartqueue.Backend.service;

import com.smartqueue.Backend.model.QueueEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@smartqueue.com}")
    private String fromEmail;

    @Value("${notification.enabled:false}")
    private boolean notificationEnabled;

    /**
     * Send "Your turn is near" email notification
     */
    public boolean sendNearTurnEmail(QueueEntry entry) {
        if (!notificationEnabled || mailSender == null) {
            System.out.println("[NOTIFICATION - Email Disabled] Would send to: "
                    + entry.getCustomerEmail()
                    + " | Token: " + entry.getTokenNumber()
                    + " | Branch: " + entry.getBranchName());
            return false;
        }

        if (entry.getCustomerEmail() == null || entry.getCustomerEmail().isBlank()) {
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(entry.getCustomerEmail());
            message.setSubject("🏦 Your Turn is Almost Here! - SmartQueue");
            message.setText(buildNearTurnEmailBody(entry));
            mailSender.send(message);
            System.out.println("[EMAIL SENT] To: " + entry.getCustomerEmail());
            return true;
        } catch (Exception e) {
            System.err.println("[EMAIL FAILED] " + e.getMessage());
            return false;
        }
    }

    /**
     * Send "Now Serving" email notification
     */
    public boolean sendServingEmail(QueueEntry entry) {
        if (!notificationEnabled || mailSender == null) {
            System.out.println("[NOTIFICATION - Email Disabled] Now Serving: "
                    + entry.getCustomerEmail()
                    + " | Token: " + entry.getTokenNumber());
            return false;
        }

        if (entry.getCustomerEmail() == null || entry.getCustomerEmail().isBlank()) {
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(entry.getCustomerEmail());
            message.setSubject("✅ It's Your Turn Now! - SmartQueue");
            message.setText(buildServingEmailBody(entry));
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            System.err.println("[EMAIL FAILED] " + e.getMessage());
            return false;
        }
    }

    private String buildNearTurnEmailBody(QueueEntry entry) {
        return "Dear " + entry.getCustomerName() + ",\n\n"
                + "Your turn is coming up soon at " + entry.getBranchName() + "!\n\n"
                + "📋 Details:\n"
                + "   Token Number : " + entry.getTokenNumber() + "\n"
                + "   Service       : " + entry.getServiceType() + "\n"
                + "   Branch        : " + entry.getBranchName() + "\n\n"
                + "Please make your way to the counter shortly.\n\n"
                + "Thank you for using SmartQueue!\n"
                + "— SmartQueue Team";
    }

    private String buildServingEmailBody(QueueEntry entry) {
        return "Dear " + entry.getCustomerName() + ",\n\n"
                + "It's YOUR turn now at " + entry.getBranchName() + "!\n\n"
                + "📋 Details:\n"
                + "   Token Number : " + entry.getTokenNumber() + "\n"
                + "   Service       : " + entry.getServiceType() + "\n"
                + "   Branch        : " + entry.getBranchName() + "\n\n"
                + "Please proceed to the counter immediately.\n\n"
                + "Thank you for using SmartQueue!\n"
                + "— SmartQueue Team";
    }
}