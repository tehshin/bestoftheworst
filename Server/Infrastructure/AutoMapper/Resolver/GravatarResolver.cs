using System;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using BestOfTheWorst.Server.Infrastructure.Helpers;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver
{
    public class GravatarResolver : IValueResolver<AppUser, object, string>
    {
        public string Resolve(AppUser source, object destination, string destMember, ResolutionContext context)
        {
            return GravatarHelper.CreateHash(source.Email);
        }
    }
}