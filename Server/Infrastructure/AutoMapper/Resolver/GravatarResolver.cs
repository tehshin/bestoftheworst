using System;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver
{
    public class GravatarResolver : IValueResolver<AppUser, object, string>
    {
        public string Resolve(AppUser source, object destination, string destMember, ResolutionContext context)
        {
            if (string.IsNullOrEmpty(source.Email))
            {
                return null;
            }

            using (var md5Hasher = MD5.Create())
            {
                byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(source.Email));
                return BitConverter.ToString(data).Replace("-", "").ToLower();
            }
        }
    }
}