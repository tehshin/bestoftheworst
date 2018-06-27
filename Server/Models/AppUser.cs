using System;
using Microsoft.AspNetCore.Identity;

namespace BestOfTheWorst.Server.Models
{
    public class AppUser : IdentityUser
    {
        public bool IsDisabled { get; set; }

        public DateTime CreationDate { get; set; }
    }
}