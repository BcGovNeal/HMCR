﻿using AutoMapper;
using Hmcr.Data.Database.Entities;
using Hmcr.Data.Repositories.Base;
using Hmcr.Model.Dtos.SubmissionObject;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Hmcr.Data.Repositories
{
    public interface ISubmissionObjectRepository
    {
        Task<HmrSubmissionObject> CreateSubmissionObjectAsync(SubmissionObjectCreateDto submission);
    }
    public class SubmissionObjectRepository : HmcrRepositoryBase<HmrSubmissionObject>, ISubmissionObjectRepository
    {
        public SubmissionObjectRepository(AppDbContext dbContext, IMapper mapper)
            : base(dbContext, mapper)
        {
        }

        public async Task<HmrSubmissionObject> CreateSubmissionObjectAsync(SubmissionObjectCreateDto submission)
        {
            var submissionEntity = await AddAsync(submission);

            foreach(var row in submission.SubmissionRows)
            {
                submissionEntity.HmrSubmissionRows
                    .Add(Mapper.Map<HmrSubmissionRow>(row));
            }

            return submissionEntity;
        }
    }
}
