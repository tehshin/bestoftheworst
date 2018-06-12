using System;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BestOfTheWorst.Server.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ImageController : Controller
    {
        private readonly IMapper _mapper;

        private readonly IImageService _imageService;

        public ImageController(IMapper mapper, IImageService imageService)
        {
            _mapper = mapper;
            _imageService = imageService;
        }

        /// <summary>
        /// Upload a image.
        /// </summary>
        /// <param name="imageFile"></param>
        /// <returns>A newly created Image</returns>
        /// <response code="201">Returns the newly created image</response>
        /// <response code="400">If the image file is null</response>
        [HttpPost("", Name = "CreateImage")]
        [ProducesResponseType(typeof(ImageViewModel), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create(IFormFile imageFile)
        {
            if (imageFile == null)
            {
                return BadRequest();
            }

            var image = await _imageService.CreateImage(imageFile.OpenReadStream(), "images/movies");

            return Created(Url.Content($"~/images/movies/{image.Id}.jpg"), _mapper.Map<ImageViewModel>(image));
        }
    }
}