using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;

namespace WebApplication1.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class RegisterModel : PageModel
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<RegisterModel> _logger;
        private readonly IEmailSender _emailSender;

        public RegisterModel(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            ILogger<RegisterModel> logger,
            IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _logger = logger;
            _emailSender = emailSender;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public string ReturnUrl { get; set; }

        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            [Display(Name = "Email")]
            public string Email { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string ConfirmPassword { get; set; }
        }

        public async Task OnGetAsync(string returnUrl = null)
        {
            ReturnUrl = returnUrl;
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            if (ModelState.IsValid)
            {
                var user = new IdentityUser { UserName = Input.Email, Email = Input.Email };
                var result = await _userManager.CreateAsync(user, Input.Password);
                if (result.Succeeded)
                {

                    result = await _userManager.AddToRoleAsync(user, "User");
                    _logger.LogInformation("User created a new account with password.");

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    var callbackUrl = Url.Page(
                        "/Account/ConfirmEmail",
                        pageHandler: null,
                        values: new { area = "Identity", userId = user.Id, code = code, returnUrl = returnUrl },
                        protocol: Request.Scheme);

                    var message =
                        "<style type='text / css'>" +
        "@media screen {" +
                        "@font - face {" +
                            "font - family: 'Lato';" +
                            "font - style: normal;" +
                            "font - weight: 400;" +
                        "src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');" +
            "}" +
                        "@font - face {" +
                            "font - family: 'Lato';" +
                            "font - style: normal;" +
                            "font - weight: 700;" +
                        "src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');" +
            "}" +
                        "@font - face {" +
                            "font - family: 'Lato';" +
                            "font - style: italic;" +
                            "font - weight: 400;" +
                        "src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');" +
            "}" +
                        "@font - face {" +
                            "font - family: 'Lato';" +
                            "font - style: italic;" +
                            "font - weight: 700;" +
                        "src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');" +
            "}" +
                    "}" +
                   "body," +
        "table," +
        "td," +
        "a {" +
                        "-webkit - text - size - adjust: 100 %;" +
                        "-ms - text - size - adjust: 100 %;" +
                    "}" +
                    "table," +
        "td {" +
                        "mso - table - lspace: 0pt;" +
                        "mso - table - rspace: 0pt;" +
                    "}" +
                    "img {" +
                        "-ms - interpolation - mode: bicubic;" +
                    "}" +
                    "img {" +
                    "border: 0;" +
                    "height: auto;" +
                        "line - height: 100 %;" +
                    "outline: none;" +
                        "text - decoration: none;" +
                    "}" +
                    "table {" +
                        "border - collapse: collapse!important;" +
                    "}" +
                    "body {" +
                    "height: 100 % !important;" +
                    "margin: 0!important;" +
                    "padding: 0!important;" +
                    "width: 100 % !important;" +
                    "}" +
                    "p {" +
                    "margin: 1.5rem;" +
                    "}" +
                    "a[x - apple - data - detectors] {" +
                    "color: inherit!important;" +
                        "text - decoration: none!important;" +
                        "font - size: inherit!important;" +
                        "font - family: inherit!important;" +
                        "font - weight: inherit!important;" +
                        "line - height: inherit!important;" +
                    "}" +
                    "@media screen and(max - width:600px) {" +
                        "h1 {" +
                            "font - size: 32px!important;" +
                            "line - height: 32px!important;" +
                        "}" +
                    "}" +
                    "div[style *= 'margin: 16px 0;'] {" +
                    "margin: 0!important;" +
                    "}" +
            "</style>" +
            "<body style='background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;'>" +
            "<div style='display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;'> We're thrilled to have you here! Get ready to dive into your new account. </div>" +
            "<table border='0' cellpadding='0' cellspacing='0' width='100%'>" +
                "<tr>" +
                    "<td bgcolor='#FFA73B' align='center'>" +
                        "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>" +
                            "<tr>" +
                                "<td align='center' valign='top' style='padding: 40px 10px 40px 10px;'></td>" +
                            "</tr>" +
                        "</table>" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td bgcolor='#FFA73B' align='center' style='padding: 0px 10px 0px 10px;'>" +
                        "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>" +
                            "<tr>" +
                                "<td bgcolor='#ffffff' align='center' valign='top' style='padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;'>" +
                                    "<h1 style='font-size: 48px; font-weight: 400; margin: 2;'>Welcome!</h1> <img src='https://img.icons8.com/clouds/100/000000/handshake.png' width='125' height='120' style='display: block; border: 0px;' />" +
                                "</td>" +
                            "</tr>" +
                        "</table>" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td bgcolor='#f4f4f4' align='center' style='padding: 0px 10px 0px 10px;'>" +
                        "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>" +
                            "<tr>" +
                                "<td bgcolor='#ffffff' align='left' style='padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>" +
                                    "<p style='margin: 1.5rem;'>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td bgcolor='#ffffff' align='left'>" +
                                    "<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                                        "<tr>" +
                                            "<td bgcolor='#ffffff' align='center' style='padding: 20px 30px 60px 30px;'>" +
                                                "<table border='0' cellspacing='0' cellpadding='0'>" +
                                                    "<tr>" +
                                                        "<td align='center' style='border-radius: 3px;' bgcolor='#FFA73B'><a href='" + HtmlEncoder.Default.Encode(callbackUrl) + "' target='_blank' style='font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;'>Confirm Account</a></td>" +
                                                    "</tr>" +
                                                "</table>" +
                                            "</td>" +
                                        "</tr>" +
                                    "</table>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td bgcolor='#ffffff' align='left' style='padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>" +
                                    "<p style='margin: 1.5rem;'>If that doesn't work, copy and paste the following link in your browser:</p>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td bgcolor='#ffffff' align='left' style='padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>" +
                                    "<p style='margin: 1.5rem;'><a href='#' target='_blank' style='color: #FFA73B;'>" + HtmlEncoder.Default.Encode(callbackUrl) + "</a></p>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td bgcolor='#ffffff' align='left' style='padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>" +
                                    "<p style='margin: 1.5rem;'>If you have any questions, just reply to this email—we're always happy to help out.</p>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td bgcolor='#ffffff' align='left' style='padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>" +
                                    "<p style='margin: 1.5rem;'>Cheers,<br>JSH DEV Team</p>" +
                                "</td>" +
                            "</tr>" +
                        "</table>" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td bgcolor='#f4f4f4' align='center' style='padding: 30px 10px 0px 10px;'>" +
                        "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>" +
                            "<tr>" +
                                "<td bgcolor='#FFECD1' align='center' style='padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;'>" +
                                    "<h2 style='font-size: 20px; font-weight: 400; color: #111111; margin: 1.5rem;'>Need more help?</h2>" +
                                    "<p style='margin: 1.5rem;'><a href='#' target='_blank' style='color: #FFA73B;'>We&rsquo;re here to help you out</a></p>" +
                                "</td>" +
                            "</tr>" +
                        "</table>" +
                    "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td bgcolor='#f4f4f4' align='center' style='padding: 0px 10px 0px 10px;'>" +
                        "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>" +
                            "<tr>" +
                                "<td bgcolor='#f4f4f4' align='left' style='padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;'> <br>" +
                                    "<p style='margin: 1.5rem;'>If these emails get annoying, please feel free to <a href='#' target='_blank' style='color: #111111; font-weight: 700;'>unsubscribe</a>.</p>" +
                                "</td>" +
                            "</tr>" +
                        "</table>" +
                    "</td>" +
                "</tr>" +
            "</table></body>";

                    await _emailSender.SendEmailAsync(Input.Email, "Confirm your email", message);

                    if (_userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        return RedirectToPage("RegisterConfirmation", new { email = Input.Email, returnUrl = returnUrl });
                    }
                    else
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return LocalRedirect(returnUrl);
                    }
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
    }
}
