﻿using Hmcr.Domain.Services;
using Hmcr.Model;
using Hmcr.Model.Dtos;
using Hmcr.Model.Dtos.User;
using Hmcr.Model.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hmcr.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;
        private HmcrCurrentUser _currentUser;

        public UsersController(IUserService userService, HmcrCurrentUser currentUser)
        {
            _userService = userService;
            _currentUser = currentUser;
        }

        [HttpGet("current")]
        public ActionResult<UserCurrentDto> GetCurrentUser()
        {
            return Ok(_currentUser.UserInfo);
        }

        [HttpGet("usertypes")]
        public ActionResult<IEnumerable<UserTypeDto>> GetUserTypes()
        {
            var userTypes = new List<UserTypeDto>()
            {
                new UserTypeDto
                {
                    UserTypeId = UserTypeDto.INTERNAL,
                    UserType = UserTypeDto.INTERNAL
                },
                new UserTypeDto
                {
                    UserTypeId = UserTypeDto.BUSINESS,
                    UserType = UserTypeDto.BUSINESS
                }
            };

            return Ok(userTypes);
        }

        [HttpGet("userstatus")]
        public ActionResult<IEnumerable<UserTypeDto>> GetUserStatus()
        {
            var statuses = new List<UserStatusDto>()
            {
                new UserStatusDto
                {
                    UserStatusId = UserStatusDto.ACTIVE,
                    UserStatus = UserStatusDto.ACTIVE
                },
                new UserStatusDto
                {
                    UserStatusId = UserStatusDto.INACTIVE,
                    UserStatus = UserStatusDto.INACTIVE
                }
            };

            return Ok(statuses);
        }

        /// <summary>
        /// Search users
        /// </summary>
        /// <param name="serviceAreas">Comma separated service area numbers. Example: serviceareas=1,2</param>
        /// <param name="userTypes">Comma separated user types. Example: usertypes=INTERNAL,BUSINESS</param>
        /// <param name="searchText">Search text for first name, last name, orgnization name, username</param>
        /// <param name="isActive">True or false</param>
        /// <param name="pageSize">Page size</param>
        /// <param name="pageNumber">Page number</param>
        /// <param name="orderBy">Order by column(s). Example: orderby=username</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<PagedDto<UserSearchDto>>> GetUsersAsync(
            [FromQuery]string? serviceAreas, [FromQuery]string? userTypes, [FromQuery]string searchText, [FromQuery]bool? isActive,
            [FromQuery]int pageSize, [FromQuery]int pageNumber, [FromQuery]string orderBy)
        {
            orderBy ??= "Username";

            return Ok(await _userService.GetUsersAsync(serviceAreas.ToDecimalArray(), userTypes.ToStringArray(), searchText, isActive, pageSize, pageNumber, orderBy));
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<ActionResult<UserDto>> GetUsersAsync(decimal id)
        {
            return await _userService.GetUserAsync(id);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(UserCreateDto user)
        {
            var errors = await _userService.ValidateUserDtoAsync(user, true);

            if (errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(errors, ControllerContext);
            }

            var systemUserId = await _userService.CreateUserAsync(user);

            return CreatedAtRoute("GetUser", new { id = systemUserId }, await _userService.GetUserAsync(systemUserId));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(decimal id, UserUpdateDto user)
        {
            if (! await _userService.DoesUserExistsAsync(id))
                return NotFound();

            if (id != user.SystemUserId)
            {
                throw new Exception($"The system user ID from the query string does not match that of the body.");
            }

            var errors = await _userService.ValidateUserDtoAsync(user, false);

            if (errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(errors, ControllerContext);
            }

            await _userService.UpdateUserAsync(user);

            return NoContent();
        }
    }
}
